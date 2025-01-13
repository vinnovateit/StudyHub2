import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
});

module.exports = mongoose?.models?.branch
  ? mongoose.models.branch
  : mongoose.model("branch", BranchSchema);
