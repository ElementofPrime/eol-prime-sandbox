import mongoose, { Schema, InferSchemaType, models } from 'mongoose';

const JournalEntrySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String },
    content: { type: String, required: true },
    mood: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Avoid OverwriteModelError in dev
const JournalEntry =
  models.JournalEntry || mongoose.model('JournalEntry', JournalEntrySchema);

export type JournalEntryDoc = InferSchemaType<typeof JournalEntrySchema>;
export default JournalEntry;
