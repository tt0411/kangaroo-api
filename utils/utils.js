const Key = 'mimashi123'
const jwt = require('jsonwebtoken')

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

module.exports = { createToken, getId, ACTIVE }