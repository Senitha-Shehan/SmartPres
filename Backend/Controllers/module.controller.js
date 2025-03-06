const Module = require("../Model/Module.model");

exports.createModule = async (req, res) => {
    try {
        const { year, semester, moduleCode, moduleName } = req.body;
        const newModule = new Module({ year, semester, moduleCode, moduleName });
        await newModule.save();
        res.status(201).json({ message: "Module added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error creating module" });
    }
};

exports.getModules = async (req, res) => {
    try {
        const modules = await Module.find();
        res.status(200).json(modules);
    } catch (error) {
        res.status(500).json({ error: "Error fetching modules" });
    }
};

exports.getModuleById = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ error: "Module not found" });
        res.status(200).json(module);
    } catch (error) {
        res.status(500).json({ error: "Error fetching module" });
    }
};

exports.updateModule = async (req, res) => {
    try {
        const updatedModule = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedModule) return res.status(404).json({ error: "Module not found" });
        res.status(200).json({ message: "Module updated successfully", updatedModule });
    } catch (error) {
        res.status(500).json({ error: "Error updating module" });
    }
};

exports.deleteModule = async (req, res) => {
    try {
        const deletedModule = await Module.findByIdAndDelete(req.params.id);
        if (!deletedModule) return res.status(404).json({ error: "Module not found" });
        res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting module" });
    }
};
