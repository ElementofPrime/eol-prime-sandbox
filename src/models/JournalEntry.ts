// src/models/JournalEntry.ts
import mongoose, { Schema, models } from 'mongoose';

const JournalEntrySchema = new Schema(
  {
    email: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    audioUrl: { type: String },
  },
  { timestamps: true }
);

export default models.JournalEntry || mongoose.model('JournalEntry', JournalEntrySchema);
