const express = require("express");
const router = express.Router();
const { 
    addEvaluation, 
    getAllEvaluations, 
    getEvaluationsByExaminer, 
    updateEvaluation, 
    deleteEvaluation 
} = require("../Controllers/evaluation.controller");

// Add an evaluation
router.post("/add", addEvaluation);

// Get all evaluations
router.get("/", getAllEvaluations);

// Get evaluations by examiner
router.get("/:examinerID", getEvaluationsByExaminer);

// Update an evaluation
router.put("/update/:id", updateEvaluation);

// Delete an evaluation
router.delete("/delete/:id", deleteEvaluation);

module.exports = router;
