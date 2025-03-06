const express = require("express");
const router = express.Router();
const moduleController = require("../Controllers/module.controller");

router.post("/", moduleController.createModule);
router.get("/", moduleController.getModules);
router.get("/:id", moduleController.getModuleById);
router.put("/:id", moduleController.updateModule);
router.delete("/:id", moduleController.deleteModule);

module.exports = router;
