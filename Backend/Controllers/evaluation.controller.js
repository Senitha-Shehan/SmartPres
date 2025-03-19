const Evaluation = require("../Model/evaluation.model");

// Add evaluation (Assign marks)
const addEvaluation = async (req, res) => {
try {
const { groupID, moduleName, examinerID, marks } = req.body;
const newEvaluation = new Evaluation({ groupID, moduleName, examinerID, marks });

await newEvaluation.save();
res.status(201).json({ message: "Evaluation saved successfully", newEvaluation });
} catch (error) {
res.status(500).json({ message: "Error saving evaluation", error });
}
};

// Get all evaluations
const getAllEvaluations = async (req, res) => {
try {
const evaluations = await Evaluation.find();
res.status(200).json(evaluations);
} catch (error) {
res.status(500).json({ message: "Error fetching evaluations", error });
}
};

// Get evaluations by examiner
const getEvaluationsByExaminer = async (req, res) => {
try {
const { examinerID } = req.params;
const evaluations = await Evaluation.find({ examinerID });

res.status(200).json(evaluations);
} catch (error) {
res.status(500).json({ message: "Error fetching evaluations", error });
}
};

// Update an evaluation (Change marks)
const updateEvaluation = async (req, res) => {
try {
const { id } = req.params;
const updatedEvaluation = await Evaluation.findByIdAndUpdate(id, req.body, { new: true });

if (!updatedEvaluation) {
    return res.status(404).json({ message: "Evaluation not found" });
}

res.status(200).json({ message: "Evaluation updated successfully", updatedEvaluation });
} catch (error) {
res.status(500).json({ message: "Error updating evaluation", error });
}
};

// Delete an evaluation
const deleteEvaluation = async (req, res) => {
try {
const { id } = req.params;
const deletedEvaluation = await Evaluation.findByIdAndDelete(id);

if (!deletedEvaluation) {
    return res.status(404).json({ message: "Evaluation not found" });
}

res.status(200).json({ message: "Evaluation deleted successfully" });
} catch (error) {
res.status(500).json({ message: "Error deleting evaluation", error });
}
};

module.exports = { addEvaluation, getAllEvaluations, getEvaluationsByExaminer, updateEvaluation, deleteEvaluation };
