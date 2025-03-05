const express = require("express");
const router = express.Router();
const moduleController = require("../Controllers/moduleController");

router.post("/modules", moduleController.createModule);
router.get("/modules", moduleController.getModules);
router.get("/modules/:id", moduleController.getModuleById);
router.put("/modules/:id", moduleController.updateModule);
router.delete("/modules/:id", moduleController.deleteModule);

module.exports = router;
