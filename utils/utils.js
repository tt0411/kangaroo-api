const Key = 'mimashi123'
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");

const createToken = (id, secretOrPrivateKey = Key) =>{
   const token = jwt.sign(id, secretOrPrivateKey);
   return token;
}

const encodeToken = (token, secretOrPrivateKey = Key) => {
    const encodedToken = jwt.verify(token, secretOrPrivateKey) 
    return encodedToken
}

const getId =(req) => {
    let raw = String(req.headers.authorization).split(' ').pop(); 
    if(raw === 'null' || raw === 'undefined') {
        return null
    }else{
        return  encodeToken(raw,secretOrPrivateKey = Key) 
    }
}

const encryptCode = (code, secretKey = 'smsCodemimashi123') => {
    return CryptoJS.DES.encrypt(code, CryptoJS.enc.Utf8.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
 }).toString()

} 
const decryptCode = (afterEncrypt, secretKey = 'smsCodemimashi123') => {
    return CryptoJS.DES.decrypt(afterEncrypt, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }
const ACTIVE = {
    LOGIN_ACTIVE: 5, 
    CREATETYPE_ACTIVE: 10,
    COMMENT_ACTIVE: 5,
    MARK_ACTIVE: 2,
    CONTEXT_ACTIVE: 10 
}

module.exports = { createToken, getId, ACTIVE, encryptCode, decryptCode }