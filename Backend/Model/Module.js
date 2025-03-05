const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  moduleCode: {
    type: String,
    required: true,
    unique: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Module", ModuleSchema);
