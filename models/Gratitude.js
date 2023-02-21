import mongoose from "mongoose";

// Defining Schema
const graSchema = new mongoose.Schema({
  list: { type: String, required: true, trim: true },
  userid: { type: String, trim: true },
});

// Model
const GraModel = mongoose.model("gra", graSchema);

export default GraModel;
