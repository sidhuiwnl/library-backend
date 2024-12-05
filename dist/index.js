"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConnect_1 = require("./lib/dbConnect");
const user_1 = __importDefault(require("./modals/user"));
const admin_1 = __importDefault(require("./modals/admin"));
const book_1 = require("./modals/book");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbConnect_1.dbConnect)();
    const { email, password, role } = req.body;
    try {
        if (!email || !password || !role) {
            res.status(400).json({
                success: false,
                message: "Email, password, and role are required",
            });
        }
        const existingUser = yield user_1.default.findOne({
            email: email,
        });
        if (existingUser) {
            res.status(401).json({
                message: "User aldready existed please sign-in",
            });
        }
        if (role === "USER") {
            const response = yield user_1.default.create({
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
    }
    catch (error) {
        console.error("Error registering user", error);
        res.status(500).json({
            success: false,
            message: "Error registering user",
        });
    }
}));
app.post("/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbConnect_1.dbConnect)();
    const { email, password, role } = req.body;
    try {
        if (!email || !password || !role) {
            res.status(400).json({
                success: false,
                message: "Email, password, and role are required",
            });
        }
        const existingAdmin = yield admin_1.default.findOne({
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
    }
    catch (error) {
        console.error("Error registering user", error);
        res.status(500).json({
            success: false,
            message: "Error registering user",
        });
    }
}));
app.get("/getBooks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbConnect_1.dbConnect)();
    try {
        const response = yield book_1.Book.find();
        res.status(200).json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching books",
        });
    }
}));
app.put("/buyBooks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbConnect_1.dbConnect)();
    const { status, bookId } = req.body;
    try {
        const updatedBook = yield book_1.Book.findByIdAndUpdate(bookId, {
            status: status,
        }, {
            new: true,
            runValidators: true,
        });
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
    }
    catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching books",
        });
    }
}));
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
