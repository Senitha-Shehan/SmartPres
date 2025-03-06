const Group = require("../Model/group.model");

// Create a Group
exports.createGroup = async (req, res) => {
    try {
        const { leaderId, leaderName, members } = req.body;

        if (!leaderId || !leaderName || !members || members.length !== 3) {
            return res.status(400).json({ message: "Leader details and exactly 3 members are required." });
        }

        const newGroup = new Group({ leaderId, leaderName, members });
        await newGroup.save();

        res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all Groups
exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get a Group by ID
exports.getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update a Group
exports.updateGroup = async (req, res) => {
    try {
        const { leaderId, leaderName, members } = req.body;

        if (!leaderId || !leaderName || !members || members.length !== 3) {
            return res.status(400).json({ message: "Leader details and exactly 3 members are required." });
        }

        const updatedGroup = await Group.findByIdAndUpdate(
            req.params.id,
            { leaderId, leaderName, members },
            { new: true }
        );

        if (!updatedGroup) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json({ message: "Group updated successfully", group: updatedGroup });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a Group
exports.deleteGroup = async (req, res) => {
    try {
        const deletedGroup = await Group.findByIdAndDelete(req.params.id);
        if (!deletedGroup) {
            return res.status(404).json({ message: "Group not found" });
        }
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
