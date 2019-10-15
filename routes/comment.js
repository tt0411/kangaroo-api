let express = require('express');
let router = express.Router();
let commentData = require('../services/comment');

router.get('/allComment', async (req, res) => {
    await commentData.allComment(req, res);
})
router.get('/isStopcomment', async (req, res) => {
    await commentData.isStopComment(req, res);
})

module.exports = router;