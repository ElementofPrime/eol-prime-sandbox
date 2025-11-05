import { Schema, model, models, Types } from "mongoose";

export interface QuickExtract {
  ToDos: string[];
  dates: string[]; // ISO or natural language
  amounts: string[]; // $123, 12.5%, etc.
  tickers: string[]; // BTC, ETH, SPY, etc.
  people: string[];
  hashtags: string[];
}

export interface PrimeInsight {
  _id: Types.ObjectId;
  entryId: Types.ObjectId; // ref JournalEntry
  userId: string;
  mood: "positive" | "neutral" | "negative";
  streak?: number;
  trend?: "rising" | "falling" | "steady";
  aura?: "calm" | "excited" | "reflective" | "stressed";
  glowIntensity?: number; // 0–1
  sentimentScore: number; // -1..1
  topics: string[]; // finance, family, fitness, etc.
  extract: QuickExtract;
  primePrompts: string[]; // coaching questions
  primeSuggestions: string[]; // action suggestions
  createdAt: Date;
}

const PrimeInsightSchema = new Schema<PrimeInsight>(
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
    sentimentScore: { type: Number, required: true },
    topics: { type: [String], default: [] },
    extract: {
      ToDos: [String],
      dates: [String],
      amounts: [String],
      tickers: [String],
      people: [String],
      hashtags: [String],
    },
    primePrompts: { type: [String], default: [] },
    primeSuggestions: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.PrimeInsight ||
  model<PrimeInsight>("PrimeInsight", PrimeInsightSchema);
