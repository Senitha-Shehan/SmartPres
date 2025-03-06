const express = require("express");
const router = express.Router();
const groupController = require("../Controllers/group.controller");

router.post("/groups", groupController.createGroup);
router.get("/groups", groupController.getAllGroups);
router.get("/groups/:id", groupController.getGroupById);
router.put("/groups/:id", groupController.updateGroup);
router.delete("/groups/:id", groupController.deleteGroup);

module.exports = router;
