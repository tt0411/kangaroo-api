let express = require('express');
let router = express.Router();
let multiparty = require('multiparty')
let OSS = require('ali-oss')
let client = new OSS({
	region: 'oss-cn-hangzhou',//阿里云对象存储地域名
	accessKeyId: 'LTAI4FeDftBXQdzfFPrLnSdy',//api接口id
	accessKeySecret: 'oq9bbUCSP7jumbsqk2WOxTTsHwghDJ',//api接口密码
})
client.useBucket('kangaroo-app')//使用的存储桶名

router.post('/uploadOss',  (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, async function(err,fields,file){
        const { path, originalFilename } = file.file[0]
        const { type } = fields
       try {
        var fileName = `${type}/`+ Date.now() + `${originalFilename}`
        let result = await client.put(fileName, path)
        if(result){
            res.send({
                code: 200,
                msg: '上传成功',
                data: result.url
            })   
        }else{
            res.send({
                code: 101,
                msg: '上传失败'
            })
        }
        } catch (err) {
            console.log(err)
        }
    });    
})

module.exports = router;