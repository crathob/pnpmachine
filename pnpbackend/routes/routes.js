const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllers');
const multer = require('multer');
const path = require('path');
const files = multer({dest: path.join(__dirname, '../files/')});

const fileuploadfields = [
    {name: 'feeders', maxCount: 1},
    {name: 'packages', maxCount: 1},
    {name: 'placements', maxCount: 1}
]

router.post('/gcode', files.fields(fileuploadfields), controller.generateGCode);
router.post('/first', controller.goToFirstPlacement);

module.exports = router;