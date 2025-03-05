const express = require("express")
const {
    createExaminer,
    getExaminers,
    updateExaminer,
    deleteExaminer
} = require("../Controllers/examiner.controller.js");

const  router = express.Router();

router.post('/',createExaminer);
router.get('/',getExaminers);
router.put('/:id',updateExaminer);
router.delete('/:id', deleteExaminer);

module.exports = router;