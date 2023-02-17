import mongoose from "mongoose";

// Defining Schema
const ltgSchema = new mongoose.Schema({
  goals: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  userid: { type: String, trim: true },
});

// Model
const LTGModel = mongoose.model("ltg", ltgSchema);

export default LTGModel;
