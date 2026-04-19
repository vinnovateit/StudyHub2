import mongoose from "mongoose";

const PaperSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    courseCode: {
      type: String,
      required: true,
      trim: true,
      ref: "courses",
    },
    examType: {
      type: String,
      required: true,
      enum: ["CAT1", "CAT2", "FAT", "Quiz"],
    },
    slot: {
      type: String,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      enum: ["Fall", "Winter"],
      },
    year: {
      type: Number,
      required: true,
    },
    pdfLink: {
      type: String,
      required: true,
      trim: true,
    },
    pdfKey: {
      type: String,
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
    },
    storageType: {
      type: String,
      enum: ["link", "r2"],
      default: "link",
    },
    isS3: {
      type: Boolean,
      default: false,
    },
    s3Key: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose?.models?.papers
  ? mongoose.models.papers
  : mongoose.model("papers", PaperSchema);
