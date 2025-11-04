// src/models/JournalEntry.ts
import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Use mongoose.models to avoid redefinition
const JournalEntrySchema = new Schema({
  userId: { type: String, required: true, index: true },
  content: { type: String, required: true },
  mood: {
    type: String,
    enum: ["positive", "negative", "neutral"],
    default: null,
  },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const JournalEntry =
  mongoose.models.JournalEntry || model("JournalEntry", JournalEntrySchema);

export default JournalEntry;
