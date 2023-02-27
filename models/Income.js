import mongoose from "mongoose";

// Defining Schema
const incSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true, trim: true },
  userid: { type: String, trim: true },
});

// Model
const IncModel = mongoose.model("inc", incSchema);

export default IncModel;
