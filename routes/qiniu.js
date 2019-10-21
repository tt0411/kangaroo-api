let express = require('express');
let router = express.Router();
const qnconfig = require('../utils/utils')

router.get('/uploadToken', (req, res, next) => {
    const token = qnconfig.uploadToken
    res.send({
        code: 200,
        msg: '上传凭证获取成功',
        token: token,
    })
})

module.exports = router;