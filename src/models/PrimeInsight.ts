import mongoose from "mongoose";
import type { Document, Types } from "mongoose"; // <-- type-only import

const { Schema, model, models } = mongoose;

export interface QuickExtract {
  ToDos: string[];
  dates: string[];
  amounts: string[];
  tickers: string[];
  people: string[];
  hashtags: string[];
}

export interface PrimeInsightDoc extends Document {
  _id: Types.ObjectId;
  entryId: Types.ObjectId;
  userId: string;
  mood: "positive" | "neutral" | "negative";
  streak?: number;
  trend?: "rising" | "falling" | "steady";
  aura?: "calm" | "excited" | "reflective" | "stressed";
  glowIntensity?: number;
  sentimentScore: number; // -1..1
  topics: string[];
  extract: QuickExtract;
  primePrompts: string[];
  primeSuggestions: string[];
  createdAt: Date;
  updatedAt?: Date;
}

const PrimeInsightSchema = new Schema<PrimeInsightDoc>(
  {
    entryId: {
      type: Schema.Types.ObjectId,
      ref: "JournalEntry",
      required: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    mood: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      required: true,
    },
    sentimentScore: { type: Number, required: true, min: -1, max: 1 },
    streak: { type: Number },
    trend: { type: String, enum: ["rising", "falling", "steady"] },
    aura: { type: String, enum: ["calm", "excited", "reflective", "stressed"] },
    glowIntensity: { type: Number, min: 0, max: 1 },
    topics: { type: [String], default: [] },
    extract: {
      ToDos: { type: [String], default: [] },
      dates: { type: [String], default: [] },
      amounts: { type: [String], default: [] },
      tickers: { type: [String], default: [] },
      people: { type: [String], default: [] },
      hashtags: { type: [String], default: [] },
    },
    primePrompts: { type: [String], default: [] },
    primeSuggestions: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const PrimeInsight =
  models.PrimeInsight ||
  model<PrimeInsightDoc>("PrimeInsight", PrimeInsightSchema);
PrimeInsightSchema.index(
  { entryId: 1 },
  { unique: true, name: "entry_unique" }
);
export default PrimeInsight;
