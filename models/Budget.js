import mongoose from "mongoose";

// Defining Schema
const budSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true, trim: true },
  userid: { type: String, trim: true },
});

// Model
const BudModel = mongoose.model("bud", budSchema);

export default BudModel;
