const Group = require("../Model/group.model");

// Create Group
exports.createGroup = async (req, res) => {
    try {
        const { moduleName, year, semester, leaderId, leaderName, members } = req.body;
        
        // Check if required fields are present
        if (!moduleName || !year || !semester || !leaderId || !leaderName || !members) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const group = new Group({
            moduleName,
            year,
            semester,
            leaderId,
            leaderName,
            members
        });

        await group.save();
        res.status(201).json({ message: "Group registered successfully", group });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Groups
exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Group by ID
exports.getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Group
exports.updateGroup = async (req, res) => {
    try {
        const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGroup) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json({ message: "Group updated successfully", updatedGroup });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Group
exports.deleteGroup = async (req, res) => {
    try {
        const deletedGroup = await Group.findByIdAndDelete(req.params.id);
        if (!deletedGroup) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
