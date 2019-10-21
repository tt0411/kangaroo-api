const Key = 'mimashi123'
const jwt = require('jsonwebtoken')
const qiniu = require('qiniu')

// 创建上传凭证
const accessKey = 'piACJtqgo0Zo93L3xYaN4IbKKiAabDsGxHZqg2kG'    //accessKey 
const secretKey = '37fEzwLy6uFqbS5iB3EgpK4BP1eWbjtnj48WBUss'    //secretKey 
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
    scope: 'xiaoxiao-app',         //对象存储空间名字
    expires: 7200
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)
 
const createToken = (id, secretOrPrivateKey = Key) =>{
   const token = jwt.sign(id, secretOrPrivateKey);
   return token;
}

const encodeToken = (token, secretOrPrivateKey = Key) => {
    const encodedToken = jwt.verify(token, secretOrPrivateKey) 
    return encodedToken
}

const getId =(req)=>{
    let raw = String(req.headers.authorization).split(' ').pop(); 
    return  encodeToken(raw,secretOrPrivateKey = Key) 
}

const ACTIVE = {
    LOGIN_ACTIVE: 5, 
    CREATETYPE_ACTIVE: 10,
    COMMENT_ACTIVE: 5,
    MARK_ACTIVE: 2,
    CONTEXT_ACTIVE: 10 
}

module.exports = { createToken, getId, ACTIVE, uploadToken }