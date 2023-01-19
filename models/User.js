import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  tc: { type: Boolean, required: true },
  usernamename: { type: String, trim: true },
  admin: { type: Boolean, required: true, trim: true },
  premiumuser: { type: Boolean, required: true, trim: true },
});

// Model
const UserModel = mongoose.model("user", userSchema);

export default UserModel;
