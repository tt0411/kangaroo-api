let express = require('express');
let router = express.Router();
let markData = require('../services/mark');

router.get('/allMark', async (req, res) => {
    await markData.allMark(req, res);
})
router.get('/markCountByCid', async (req, res) => {
    await markData.getMarkByCid(req, res);
})
router.post('/isMarkContent', async (req, res) => {
    await markData.isMarkContent(req, res);
})
router.get('/markSign', async (req, res) => {
    await markData.markSign(req, res);
})
router.get('/getMarkByUid', async (req, res) => {
    await markData.getMarkByUid(req, res);
})

module.exports = router;