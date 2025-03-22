const Examiner = require("../Model/examiner.model");

// Create new examiner
const createExaminer = async (req, res) => {
    try {
        let { examinerID, name, module, email } = req.body;

        if (!Array.isArray(module)) {
            module = [module]; // Ensure it's always an array
        }

        const existingExaminer = await Examiner.findOne({ examinerID });

        if (existingExaminer) {
            // Prevent duplicate module assignments
            const newModules = module.filter(m => !existingExaminer.module.includes(m));

            if (newModules.length === 0) {
                return res.status(400).json({ message: "Examiner is already assigned to these modules." });
            }

            // Update examiner's modules
            existingExaminer.module.push(...newModules);
            await existingExaminer.save();
            return res.status(200).json({ message: "Examiner updated with new modules.", examiner: existingExaminer });
        }

        // Create new examiner
        const newExaminer = new Examiner({ examinerID, name, module, email });
        await newExaminer.save();

        res.status(201).json({ message: "Examiner created successfully.", examiner: newExaminer });
    } catch (error) {
        res.status(400).json({ message: "Error creating examiner.", error: error.message });
    }
};

// Get all examiners
const getExaminers = async (req, res) => {
    try {
        const examiners = await Examiner.find();
        res.status(200).json(examiners);
    } catch (error) {
        res.status(400).json({ message: "Error retrieving examiners.", error: error.message });
    }
};

// Update an examiner
const updateExaminer = async (req, res) => {
    try {
        let { module } = req.body;

        if (!Array.isArray(module)) {
            module = [module];
        }

        const updatedExaminer = await Examiner.findByIdAndUpdate(req.params.id, { ...req.body, module }, { new: true });

        if (!updatedExaminer) {
            return res.status(404).json({ message: "Examiner not found." });
        }

        res.status(200).json({ message: "Examiner updated successfully.", examiner: updatedExaminer });
    } catch (error) {
        res.status(400).json({ message: "Error updating examiner.", error: error.message });
    }
};

// Delete an examiner
const deleteExaminer = async (req, res) => {
    try {
        const examiner = await Examiner.findByIdAndDelete(req.params.id);

        if (!examiner) {
            return res.status(404).json({ message: "Examiner not found." });
        }

        res.status(200).json({ message: "Examiner deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: "Error deleting examiner.", error: error.message });
    }
};

module.exports = {
    createExaminer,
    getExaminers,
    updateExaminer,
    deleteExaminer
};
