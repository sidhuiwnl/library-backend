import mongoose, { Schema } from "mongoose";

enum Role{
    USER = "USER",
    ADMIN = "ROLE"
}

const AdminSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },

  role : {
    type : String,
    required : [true],
    enum : Object.values(Role)
  }
});

const Admin= mongoose.models.Admin || mongoose.model("Admin", AdminSchema);


export default Admin
