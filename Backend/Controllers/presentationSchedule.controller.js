const presentationSchedule = require("../Model/presentationSchedule.model");

// Schedule a new presentation
const createPresentation = async (req, res) => {
    try {
        const { year, semester, module, examiner, date, duration } = req.body;

        const newPresentation = new presentationSchedule({
            year,
            semester,
            module,
            examiner,
            date,
            duration,
        });

        await newPresentation.save();
        res.status(201).json({ message: "Presentation scheduled successfully", newPresentation });
    } catch (error) {
        res.status(500).json({ error: "Failed to schedule presentation", details: error.message });
    }
};

// Get all scheduled presentations
const getPresentations = async (req, res) => {
    try {
        const presentations = await presentationSchedule.find();
        res.status(200).json(presentations);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch presentations", details: error.message });
    }
};

// Update a presentation
const updatePresentation = async (req, res) => {
    try {
        const updatedPresentation = await presentationSchedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedPresentation) {
            return res.status(404).json({ error: "Presentation not found" });
        }

        res.status(200).json({ message: "Presentation updated successfully", updatedPresentation });
    } catch (error) {
        res.status(500).json({ error: "Failed to update presentation", details: error.message });
    }
};

// Delete a presentation
const deletePresentation = async (req, res) => {
    try {
        const deletedPresentation = await presentationSchedule.findByIdAndDelete(req.params.id);

        if (!deletedPresentation) {
            return res.status(404).json({ error: "Presentation not found" });
        }

        res.status(200).json({ message: "Presentation deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete presentation", details: error.message });
    }
};

module.exports = {
    createPresentation,
    getPresentations,
    updatePresentation,
    deletePresentation
};
