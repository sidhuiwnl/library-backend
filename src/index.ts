import express from "express";
import { SignUpResponse } from "./types";
import { dbConnect } from "./lib/dbConnect";
import mongoose from "mongoose";
import User from "./modals/user";
import AdminModel from "./modals/admin";
import { Book } from "./modals/book";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  await dbConnect();

  const { email, password, role }: SignUpResponse = req.body;

  try {
    if (!email || !password || !role) {
      res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    const existingUser = await User.findOne({
      email: email,
    });

    if (existingUser) {
      res.status(401).json({
        message: "User aldready existed please sign-in",
      });
    }
    if (role === "USER") {
      const response = await User.create({
        email: email,
        password: password,
        role: role,
      });

      if (response) {
        res.json({
          message: "User created successfully",
          response,
        });
      }
    }
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
});

app.post("/admin", async (req, res) => {
  await dbConnect();
  const { email, password, role }: SignUpResponse = req.body;

  try {
    if (!email || !password || !role) {
      res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    const existingAdmin = await AdminModel.findOne({
      email: email,
      role: role,
    });

    if (!existingAdmin) {
      res.status(404).json({
        message: "The credientals are incorrect for admin access",
      });
    }

    res.status(200).json({
      sucess: true,
      message: "Admin access granted",
    });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
});

app.get("/getBooks", async (req, res) => {
  await dbConnect();
  try {
    const response = await Book.find();
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching books",
    });
  }
});

app.put("/buyBooks", async (req, res) => {
  await dbConnect();

  const { status, bookId } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        status: status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    res.status(200).json([
      {
        success: true,
        data: updatedBook,
      },
    ]);
  } catch (error) {
    console.error("Error fetching books:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching books",
    });
  }
});



app.listen(3000, () => {
  console.log("Server running on port 3000");
});
