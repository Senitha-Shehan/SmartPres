const mongoose = require("mongoose");

const presentationScheduleSchema = new mongoose.Schema({
    year: String,
    semester: String,
    module: String,
    examiner: String,
    date: Date,
    duration: Number,
    status: { type: String, enum: ["available", "unavailable", "pending"], default: "pending" } 
});

const presentationSchedule = mongoose.model("presentationSchedule", presentationScheduleSchema);

module.exports = presentationSchedule;
