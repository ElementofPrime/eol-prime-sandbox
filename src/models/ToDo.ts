// src/models/ToDo.ts
import mongoose from "mongoose";

const ToDoSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const ToDo = mongoose.models.ToDo || mongoose.model("ToDo", ToDoSchema);

export default ToDo;
