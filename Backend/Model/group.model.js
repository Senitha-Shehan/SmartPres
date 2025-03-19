const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    moduleName: { type: String, required: true },
    year: { type: String, required: true },
    semester: { type: String, required: true },
    leaderId: { type: String, required: true },
    leaderName: { type: String, required: true },
    members: [
        {
            memberId: { type: String, required: true },
            memberName: { type: String, required: true }
        }
    ]
}, { timestamps: true }); // Optionally add timestamps to track when a group is created/modified

module.exports = mongoose.model("Group", groupSchema);
