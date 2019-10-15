let express = require('express');
let router = express.Router();
let contentData = require('../services/content');


router.post('/createContent',async (req, res) => {
    await contentData.createContent(req, res);
});
router.get('/getContentByTid', async (req, res) => {
    await contentData.getContentByTid(req, res);
})
router.get('/getAllContents', async (req, res) => {
    await contentData.getAllContents(req, res);
})
router.get('/allContentsRoot', async (req, res) => {
    await contentData.getAllContentsRoot(req, res);
})
router.get('/getContentByUid', async (req, res) => {
    await contentData.getContentByUid(req, res);
})
router.get('/getContentById', async (req, res) => {
    await contentData.getContentById(req, res);
})
router.get('/isStopContent', async (req, res) => {
    await contentData.isStopContent(req, res);
})
router.get('/todayContent', async (req, res) => {
    await contentData.todayAddContent(req, res);
})
router.get('/todayContentRate', async (req, res) => {
    await contentData.todayAddContentRate(req, res);
})


module.exports = router;