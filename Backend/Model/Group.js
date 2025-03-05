const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    leaderId: { type: String, required: true },
    leaderName: { type: String, required: true },
    members: [
        {
            memberId: { type: String, required: true },
            memberName: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model("Group", groupSchema);
