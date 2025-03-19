const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema({
  groupID: { type: String, required: true }, // e.g., "DSA01"
  moduleName: { type: String, required: true }, // e.g., "DSA"
  examinerID: { type: String, required: true }, // e.g., "EX001"
  marks: { type: Number, required: true } // Entered manually by examiner
});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
