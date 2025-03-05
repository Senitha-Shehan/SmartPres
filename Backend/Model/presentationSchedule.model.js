const mongoose = require("mongoose");

const presentationScheduleSchema = new mongoose.Schema({
    year: String,
    semester: String,
    module: String,
    examiner: String,
    date: Date,
    duration: Number,
});

const presentationSchedule = mongoose.model("presentationSchedule", presentationScheduleSchema);

module.exports = presentationSchedule; 
