let express = require('express');
let router = express.Router();
let contentData = require('../services/content');


router.post('/createContent',async (req, res) => {
    await contentData.createContent(req, res);
});
router.get('/getOpencontentByTid', async (req, res) => {
    await contentData.getOpencontentByTid(req, res)
})
router.get('/getMycontentByTid', async (req, res) => {
    await contentData.getMycontentByTid(req, res)
})
router.get('/getAllContents', async (req, res) => {
    await contentData.getAllContents(req, res);
})
router.get('/getMyMarkContent', async (req, res) => {
    await contentData.getMyMarkContent(req, res)
})
router.get('/getMySaveContent', async (req, res) => {
    await contentData.getMySaveContent(req, res)
})
router.get('/allContentsRoot', async (req, res) => {
    await contentData.getAllContentsRoot(req, res);
})
router.get('/getContentByUid', async (req, res) => {
    await contentData.getContentByUid(req, res);
})
router.get('/getcontentCountByUid', async (req, res) => {
    await contentData.getcontentCountByUid(req, res)
})
router.get('/getContentById', async (req, res) => {
    await contentData.getContentById(req, res);
})
router.post('/isDelContent', async (req, res) => {
    await contentData.isDelContent(req, res);
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
router.get('/waitContentRoots', async (req, res) => {
    await contentData.waitContentRoots(req, res);
})
router.get('/waitDealCount', async (req, res) => {
    await contentData.waitDealCount(req, res);
})


module.exports = router;