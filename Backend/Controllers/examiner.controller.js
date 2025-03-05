const Examiner = require("../Model/examiner.model");

// Create new examier
const createExaminer = async (req, res) =>{
    try {
        const { examinerID, name, module, email } = req.body;

        const newExaminer = new Examiner ({
            examinerID,
            name,
            module,
            email
        });

        await newExaminer.save();
        res.status(201).json({message: 'Examiner ccreated successfully', examiner: newExaminer});
    } catch (error) {
        res.status(400).json({message: 'Error creating examiner', error: error.message});
        
    }
};

//Get all examiners
const getExaminers = async (req, res) => {
    try {
        const examiners = await Examiner.find();
        res.status(200).json(examiners);
    } catch (error) {
        res.status(400).json({ message:'Error retreving examiners', error: error.message});
    }
};

const updateExaminer = async (req, res) => {
    try {
        const updateExaminer = await Examiner.findByIdAndUpdate(req.params.id, req.body, { new: true});
        if(!updateExaminer){
            return res.status(404).json({message: 'Examiner not found'});
        }
        res.status(200).json({message: 'Examiner update successfully', examiner: updateExaminer})
    } catch (error) {
        res.status(400).json({ message: 'Error updating examiner', error: error.message });
    }
};

const deleteExaminer = async (req, res) => {
    try {
        const examiner = await Examiner.findByIdAndDelete(req.params.id);
        if (!examiner) {
            return res.status(404).json({ message: 'Examiner not found' });
        }
        res.status(200).json({ message: 'Examiner deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting examiner', error: error.message });
    }
};

module.exports = {
    createExaminer,
    getExaminers,
    updateExaminer,
    deleteExaminer
};