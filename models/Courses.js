import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    storageType: {
      type: String,
      enum: ["link", "r2"],
      default: "link",
    },
    // future S3 support
    isS3: { type: Boolean, default: false },
    key: { type: String },
    mimetype: { type: String },
    fileName: { type: String, trim: true },
  },
  { _id: false }
);

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true }, // topic-wise description (optional stuff)
  // topic resources
  pdfs: { type: [UrlSchema], default: [] },
  links: { type: [UrlSchema], default: [] },
  videos: { type: [UrlSchema], default: [] },
});

const ModuleSchema = new mongoose.Schema({
  num: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  topics: { type: [TopicSchema], required: true, default: [] },
  // common module resources
  pdfs: { type: [UrlSchema], default: [] },
  links: { type: [UrlSchema], default: [] },
  videos: { type: [UrlSchema], default: [] },
});

const CourseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    preview: { type: String, required: true, trim: true }, // shown on course card
    modules: { type: [ModuleSchema], default: [] },
    // common course resources (websites, books, etc.)
    links: { type: [UrlSchema], default: [] },
    videos: { type: [UrlSchema], default: [] },
    DAs: { type: [UrlSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose?.models?.courses
  ? mongoose.models.courses
  : mongoose.model("courses", CourseSchema);
