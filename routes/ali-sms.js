let express = require('express');
let router = express.Router();
const Core = require('@alicloud/pop-core');
const { encryptCode } = require("../utils/utils");

router.post('/sendSmsCode', async function (req, res) {
    const { phone } = req.query
    const CODE = Math.random().toString().slice(-6)
    var client = new Core({
      accessKeyId: '', 
      accessKeySecret: '', 
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    })
    var params = {
      "RegionId": "cn-hangzhou",
      "PhoneNumbers": `${phone}`,
      "SignName": "袋鼠空间",
      "TemplateCode": "SMS_187570092",
      "TemplateParam": `{code: ${CODE}}`
    }
    var requestOption = {
      method: 'POST'
    }
    var result = await client.request('SendSms', params, requestOption).then((res) => {
        return res
      }, (ex) => {
        return ex
      }) 
    if ('Code' in result) {
    res.send({
        code: 200,
        msg: '验证码发送成功',
        smsCode: encryptCode(CODE)
    })   
     
    } else {
      const limit = result.data.Message.split(':')[1]
      if(limit >= 10) {
           res.send({
               code: '201',
               msg: '同一手机号每天只能发送 10 条验证码'
           })
      }else {
        res.send({
            code: '201',
            msg: '同一手机号每小时只能发送 5 条验证码'
        }) 
      }
    }
  })
  
  module.exports = router;