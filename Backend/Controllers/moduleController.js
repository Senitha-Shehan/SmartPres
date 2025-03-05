const Module = require("../Model/Module");

// Create a new module
exports.createModule = async (req, res) => {
  try {
    const { year, semester, moduleCode, moduleName } = req.body;
    const newModule = new Module({ year, semester, moduleCode, moduleName });
    await newModule.save();
    res.status(201).json({ message: "Module added successfully", newModule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all modules
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single module by ID
exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a module
exports.updateModule = async (req, res) => {
  try {
    const { year, semester, moduleCode, moduleName } = req.body;
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      { year, semester, moduleCode, moduleName },
      { new: true }
    );
    if (!updatedModule) return res.status(404).json({ message: "Module not found" });
    res.status(200).json({ message: "Module updated successfully", updatedModule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a module
exports.deleteModule = async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);
    if (!deletedModule) return res.status(404).json({ message: "Module not found" });
    res.status(200).json({ message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
