const Group = require("../Model/group.model");

// Create Group
exports.createGroup = async (req, res) => {
    try {
        const { moduleName, year, semester, leaderId, leaderName, members } = req.body;
        
        // Check if required fields are present
        if (!moduleName || !year || !semester || !leaderId || !leaderName || !members) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Generate a unique groupId (you can modify the format as needed)
        const groupId = `${moduleName}${year}${semester}${Math.floor(Math.random() * 10000)}`;

        // Create new group instance
        const group = new Group({
            groupId, // Use the generated groupId
            moduleName,
            year,
            semester,
            leaderId,
            leaderName,
            members
        });

        // Save the group to the database
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

// Get Group by Student IT Number (updated for multiple groups)
exports.getGroupByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Find all groups where the student is either the leader or a member
        const groups = await Group.find({
            $or: [{ leaderId: studentId }, { "members.memberId": studentId }]
        });

        if (groups.length === 0) {
            return res.status(404).json({ error: "No groups found for this student" });
        }

        res.status(200).json(groups);  // Return all groups the student is part of
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

