import mongoose, { Schema, models, model } from "mongoose";

const JournalEntrySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    mood: { type: String, required: false, default: null },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default models.JournalEntry || model("JournalEntry", JournalEntrySchema);
