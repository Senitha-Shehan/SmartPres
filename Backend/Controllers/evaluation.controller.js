const Evaluation = require("../Model/evaluation.model");

// Add Evaluation (Assign marks with remarks)
const addEvaluation = async (req, res) => {
  try {
    console.log("Received evaluation request:", req.body); // Debugging Log

    const { groupID, moduleName, examinerID, marks, remarks } = req.body;

    if (!groupID || !moduleName || !examinerID || marks == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEvaluation = new Evaluation({
      groupID,
      moduleName,
      examinerID,
      marks,
      remarks: remarks || "",
    });

    await newEvaluation.save();
    res
      .status(201)
      .json({ message: "Evaluation saved successfully", newEvaluation });
  } catch (error) {
    console.error("Error saving evaluation:", error);
    res
      .status(500)
      .json({ message: "Error saving evaluation", error: error.message });
  }
};

// Get all evaluations
const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find();
    res.status(200).json(evaluations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching evaluations", error: error.message });
  }
};

// Get evaluations by examiner
const getEvaluationsByExaminer = async (req, res) => {
  try {
    const { examinerID } = req.params;
    const evaluations = await Evaluation.find({ examinerID });

    if (evaluations.length === 0) {
      return res
        .status(404)
        .json({ message: "No evaluations found for this examiner" });
    }

    res.status(200).json(evaluations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching evaluations", error: error.message });
  }
};

// Update an evaluation
const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, remarks } = req.body;

    const updatedEvaluation = await Evaluation.findByIdAndUpdate(
      id,
      { marks, remarks },
      { new: true }
    );

    if (!updatedEvaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    res
      .status(200)
      .json({ message: "Evaluation updated successfully", updatedEvaluation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating evaluation", error: error.message });
  }
};

// Delete an evaluation
const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvaluation = await Evaluation.findOneAndDelete({
      groupID: id,
    });

    if (!deletedEvaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    res.status(200).json({ message: "Evaluation deleted successfully" });
  } catch (error) {
    console.error("Error deleting evaluation:", error);
    res
      .status(500)
      .json({ message: "Error deleting evaluation", error: error.message });
  }
};

module.exports = {
  addEvaluation,
  getAllEvaluations,
  getEvaluationsByExaminer,
  updateEvaluation,
  deleteEvaluation,
};
