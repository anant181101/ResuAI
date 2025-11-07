import mongoose from 'mongoose';

const ResumeAnalysisSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  resumeName: String,
  score: Number,
  improvements: [String],
  linkedinBio: String,
  rawText: String,
  keywords: [String],
  matched: [String],
  missing: [String],
  parseCoverage: Number,
  scoreBreakdown: {
    keywords: Number,
    readability: Number,
    format: Number,
    impact: Number,
  },
  jdMatch: {
    percent: Number,
    missingKeywords: [String],
    weakKeywords: [String],
  },
}, { timestamps: true });

export default mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
