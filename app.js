const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
const schedule = require('node-schedule')
const formidableMiddleware = require('express-formidable');
app.use(express.json())

//允许跨域
app.use(cors());
app.use(formidableMiddleware());

const user = require('./routes/user')
const theme = require('./routes/theme')
const content = require('./routes/content')
const comment = require('./routes/comment')
const save = require('./routes/save')
const mark = require('./routes/mark')
const alioss = require('./routes/ali-oss')

app.use('/user', user)
app.use('/theme', theme)
app.use('/content', content)
app.use('/comment', comment)
app.use('/save', save)
app.use('/mark', mark)
app.use('/alioss', alioss)

app.listen(3002, () =>{
      // 6个占位符从左到右分别代表：秒、分、时、日、月、周几
      // *表示通配符，匹配任意，当秒是*时，表示任意秒数都触发，其它类推
      (()=>{
        //每天的凌晨1点1分1秒触发
        schedule.scheduleJob('1 1 1 * * *',()=>{
         console.log('scheduleCronstyle:'+ new Date());
         axios.get('http://localhost:3002/user/resetActive').then(data=>{
             console.log(data.data)
         })
        })  
      })();
    console.log('3002 port is opened')
   
})