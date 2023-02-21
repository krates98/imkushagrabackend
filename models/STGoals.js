import mongoose from "mongoose";

// Defining Schema
const stgSchema = new mongoose.Schema({
  goals: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  completed: { type: Boolean, required: true },
  userid: { type: String, trim: true },
});

// Model
const STGModel = mongoose.model("stg", stgSchema);

export default STGModel;
