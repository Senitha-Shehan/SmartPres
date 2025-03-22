const express = require("express");
const { 
    createPresentation, 
    getPresentations, 
    updatePresentation, 
    deletePresentation,
    getPresentationsByModule 
} = require("../Controllers/presentationSchedule.controller.js");

const router = express.Router();

router.post("/schedule", createPresentation);
router.get("/", getPresentations);
router.put("/:id", updatePresentation);
router.delete("/:id", deletePresentation);
router.get("/module/:moduleName", getPresentationsByModule);


module.exports = router;
