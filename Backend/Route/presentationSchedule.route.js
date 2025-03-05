const express = require("express");
const { 
    createPresentation, 
    getPresentations, 
    updatePresentation, 
    deletePresentation 
} = require("../Controllers/presentationSchedule.controller.js");

const router = express.Router();

router.post("/schedule", createPresentation);
router.get("/", getPresentations);
router.put("/:id", updatePresentation);
router.delete("/:id", deletePresentation);

module.exports = router;
