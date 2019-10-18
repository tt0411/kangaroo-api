let mysql = require("mysql");
let mysqlconfig = require("../config/mysql");
let poolextend = require("../modules/poolextend");
let { content, user } = require("../modules/sql");
let json = require("../modules/json");
let pool = mysql.createPool(poolextend({}, mysqlconfig));
let moment = require("moment");
const { getId, ACTIVE } = require("../utils/utils");

let contentData = {
  createContent: (req, res) => { // 用户发布内容
    const { context, status, mood, img, address, tid} = req.body;
    const id = getId(req);
    pool.getConnection((err, connection) => {
      connection.query(
        content.createContent,
        [context, mood, img, status, address, +tid],
        (err, result) => {
          if (err) {
            result = undefined; 
            json(res, result);
          } else {
            if (result) {
              connection.query(user.changeActive, [ACTIVE.CONTEXT_ACTIVE, id], (err, result) => {
                if(err){
                  result = undefined
                }else{
                  res.send({
                    code: 200,
                    msg: '内容发表成功,活跃度 +'+ACTIVE.CONTEXT_ACTIVE,
                  })
                }

              })  
            } 
          }
          connection.release();
        }
      )
    })
  },
  getAllContents: (req, res) => { // 用户查看所有公开内容
    const {per, page} = req.query
    pool.getConnection((err, connection) => {
      connection.query(content.getAllContents, (err, result) => {
        if (err) {
          result = undefined; 
          json(res, result);
        }
       else {
        let offset=parseInt(page || 1)
        let limit=parseInt(per || 10)
        let newArry=result.slice((offset-1)*limit, offset*limit)
        let hasmore=offset+limit > result.length ? false : true
        const _result = {
            hasmore,
            count: result.length,
            list: newArry,
            code: 200
        }
        json(res, _result);
       }
      
       connection.release();
      })
    })
  },
  getAllContentsRoot: (req, res) => { // 管理员查看所有内容(包含不公开，以及违规内容)
    let {per, page, mood, flag, status, name, nickName, id} = req.query
    mood = mood || '%%'
    flag = flag || '%%'
    status = status || '%%'
    id = id || '%%'
    if(name === undefined){name = '%%'} else{name = `%${name}%`}
    if(nickName === undefined){nickName = '%%'} else{nickName = `%${nickName}%`}
    pool.getConnection((err, connection) => {
      connection.query(content.getAllContentsRoot,[mood, flag, status, name, nickName, id], (err, result) => {
        if (err) {
          result = undefined; 
          json(res, result);
        }
       else {
        let offset=parseInt(page || 1)
        let limit=parseInt(per || 10)
        let newArry=result.slice((offset-1)*limit, offset*limit)
        let _newArry = [];
        newArry.forEach(item => {
           _newArry.push({
             img: item.img.split(','),
             id: item.id,
             tid: item.tid,
             context: item.context, 
             mood: item.mood,
             flag: item.flag,
             status: item.status,
             create_time: item.create_time,
             updatetime: item.updatetime,
             name: item.name,
             nickName: item.nickName,
             imgUrl: item.imgUrl,
             video: item.video,
             audio: item.audio,
             uid: item.uid
           })
        })   
        let hasmore=offset+limit > result.length ? false : true
        const _result = {
            hasmore,
            count: result.length,
            list: _newArry,
            code: 200
        }
        json(res, _result);
       }
      
       connection.release();
      })
    })
  },
  getContentByTid: (req, res) => { // 用户获取某一主题下的内容
    let { tid } = req.query;
    pool.getConnection((err, connection) => {
      connection.query(content.getcontentByTid, tid, (err, result) => {
        if (err) {
          result = undefined;
        } else {
          if (result) {
            let _result = result;
            result = {
              result: "select",
              data: _result,
              code: 200
            }
          } 
        }
        json(res, result);
        connection.release();
      })
    })
  },
  getContentByUid: (req, res) => { // 用户获取所有发表的内容
    const uid = getId(req)
    pool.getConnection((err, connection) => {
      connection.query(content.getcontentByUid, uid, (err, result) => {
        if (err) {
          result = undefined;
        } else {
          if (result) {
            let _result = result;
            result = {
              result: "select",
              data: _result,
              code: 200
            }
          } 
        }
        json(res, result);
        connection.release();
      })
    })
  },
  getContentById: (req, res) => { // 获取某一条内容
    const { id } = req.query
    pool.getConnection((err, connection) => {
      connection.query(content.getcontentById, id, (err, result) => {
        if (err) {
          result = undefined;
        } else {
          if (result) {
            let _result = result;
            result = {
              result: "select",
              data: _result,
              code: 200
            }
          } 
        }
        json(res, result);
        connection.release();
      })
    })
  },
  isStopContent: (req, res) => { // 封禁，解禁内容(管理员)
    const { id, flag } = req.query;
    pool.getConnection((err, connection) => {
      connection.query(content.isStopContent, [flag, id], (err, result) => {
        if(err){
          result = undefined;
          json(res, result);
          throw err;
        }else{
          if(result){
            res.send({
              code: 200,
              msg: '操作成功'
            })
          }else{
            result = undefined; 
            json(res, result);
          }
        }
       
        connection.release();
      })
    })
  },
  todayAddContent: (req, res) => { // 获取今日增加内容(管理员)
    const {per, page } = req.query;
    const date = moment(Date.now()).format('YYYY-MM-DD')
    pool.getConnection((err, connection) => {
      connection.query(content.todayAddContent, date,(err, result) => {
        if (err) {
          result = undefined;
          json(res, result)
          throw err;
        }
       else {
        let offset=parseInt(page || 1)
        let limit=parseInt(per || 10)
        let newArry=result.slice((offset-1)*limit, offset*limit)
        let hasmore=offset+limit > result.length ? false : true
        const _result = {
            hasmore,
            list: newArry,
            count: result.length,
            code: 200
        }
         json(res, _result);
       }
        connection.release();
      })
    })
  },
  todayAddContentRate: (req, res) => { // 获取今日增加内容比例(管理员)
    const date = moment(Date.now()).format('YYYY-MM-DD')
    pool.getConnection((err, connection) => {
      connection.query(content.todayAddContentRate, [date, date],(err, result) => {
        if (err) {
          result = undefined;
          json(res, result)
          throw err;
        }
       else {
          if(result){
            let _result = {
              count: result[0].count,
              rate: ((result[0].rate)*100).toFixed(2)
            }
            res.send({
              code: 200,
              data: _result
            })
          }
       }
        connection.release();
      })
    })
  },
}

module.exports =  contentData 
