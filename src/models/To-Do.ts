// src/models/To-Do.ts
import mongoose from "mongoose";

const To-DoSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const To-Do = mongoose.models.To-Do || mongoose.model("To-Do", To-DoSchema);

export default To-Do;
