import { Schema, model, models, Types } from 'mongoose';


export interface JournalEntry {
_id: Types.ObjectId;
userId: string; // from auth session
content: string;
createdAt: Date;
updatedAt: Date;
tags?: string[]; // free-form labels
}


const JournalEntrySchema = new Schema<JournalEntry>({
userId: { type: String, required: true, index: true },
content: { type: String, required: true },
tags: { type: [String], default: [] }
}, { timestamps: true });


export default models.JournalEntry || model<JournalEntry>('JournalEntry', JournalEntrySchema);