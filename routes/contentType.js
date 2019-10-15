let express = require('express');
let router = express.Router();
let contentTypeData = require('../services/contentType');


router.post('/createContentType',async (req, res) => {
    await contentTypeData.createContentType(req, res);
});
router.get('/getContentTypeByUid', async (req, res) => {
    await contentTypeData.getcontentTypeByUid(req, res);
})
router.post('/updateContentType', async (req, res) => {
    await contentTypeData.updatecontentType(req, res);
})
router.get('/isdeleteContentType', async (req, res) => {
    await contentTypeData.isdeleteContentType(req, res);
})
router.get('/allContentType', async (req, res) => {
    await contentTypeData.allContentType(req, res);
})
router.get('/todayContentType', async (req, res) => {
    await contentTypeData.todayContentType(req, res);
})

module.exports = router;