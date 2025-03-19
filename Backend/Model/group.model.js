const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupId: { type: String, required: true, unique: true }, // Add this field
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
}, { timestamps: true }); 


module.exports = mongoose.model("Group", groupSchema);
