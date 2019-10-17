let express = require('express');
let router = express.Router();
let markData = require('../services/mark');

router.get('/allMark', async (req, res) => {
    await markData.allMark(req, res);
})
router.get('/markCountByCid', async (req, res) => {
    await markData.getMarkByCid(req, res);
})

module.exports = router;