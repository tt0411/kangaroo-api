const Key = 'mimashi123'
const jwt = require('jsonwebtoken')
<<<<<<< HEAD
const CryptoJS = require("crypto-js");
=======
>>>>>>> master

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

  const formatTime = stringTime => {
    let minute = 1000 * 60;
    let hour = minute *60;
    let day = hour *24;
    let week = day * 7;
    let month = day * 30;
    let year = month * 12;
        let time1 = new Date().getTime();//当前的时间戳
        let time2 = Date.parse(new Date(stringTime));//指定时间的时间戳
        let time = time1 - time2;
        let result = null;
        if(time/year >= 1) {
            result = parseInt(time/year) + "年前";
        }else if(time/month >= 1){
            result = parseInt(time/month) + "月前";
        }else if(time/week >= 1){
            result = parseInt(time/week) + "周前";
        }else if(time/day >= 1){
            result =  parseInt(time/day) + "天前";
        }else if(time/hour >= 1){
            result = parseInt(time/hour) + "小时前";
        }else if(time/minute >= 1){
            result = parseInt(time/minute) + "分钟前";
        }else {
            result = "刚刚";
        }
       return result
    }

const ACTIVE = {
    LOGIN_ACTIVE: 5, 
    CREATETYPE_ACTIVE: 10,
    COMMENT_ACTIVE: 5,
    MARK_ACTIVE: 2,
    CONTEXT_ACTIVE: 10 
}

module.exports = { createToken, getId, ACTIVE, encryptCode, decryptCode, formatTime }