const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema(
  {
    groupID: { type: String, required: true },
    moduleName: { type: String, required: true },
    examinerID: { type: String, required: true },
    marks: { type: Number, required: true, min: 0, max: 100 }, // Validating marks range (0-100)
    remarks: { type: String, default: "" }, // Default to empty string
  },
  { timestamps: true }
); // Add timestamps for createdAt & updatedAt

module.exports = mongoose.model("Evaluation", EvaluationSchema);
