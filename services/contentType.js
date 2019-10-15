let mysql = require("mysql");
let mysqlconfig = require("../config/mysql");
let poolextend = require("../modules/poolextend");
let moment = require("moment");
let { contentType, content, user } = require("../modules/sql");
let json = require("../modules/json");
let pool = mysql.createPool(poolextend({}, mysqlconfig));
const { getId, ACTIVE } = require("../utils/utils");

let contentTypeData = {
  createContentType: (req, res) => {
    const params = req.body;
    const uid = getId(req);
    pool.getConnection((err, connection) => {
      connection.query(
        contentType.createcontentType,
        [params.name, params.bgcolor, params.icon, +uid],
        (err, result) => {
          if (err) {
            result = undefined;
            json(res, result);
          } else {
            if (result) {
              connection.query(user.changeActive, [ACTIVE.CREATETYPE_ACTIVE, uid], (err, result) => {
                if(err){
                  result = undefined
                  json(res, result);
                }else{
                  res.send({
                    code: 200,
                    msg: '主题创建成功,活跃度 +'+ACTIVE.CREATETYPE_ACTIVE,
                  })
                }
              })  
             
            }else{
              result = undefined;
              json(res, result);
            } 
          }
          connection.release();
        }
      )
    })
  },
  getcontentTypeByUid: (req, res) => { // 用户获取自己创建的主题
    let uid = getId(req);
    pool.getConnection((err, connection) => {
      connection.query(contentType.getcontentTypeByUid, uid, (err, result) => {
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
          }else{
            result = undefined; 
          } 
        }
        json(res, result);
        connection.release();
      })
    })
  },
  updatecontentType: (req, res) => { // 用户修改主题
    let { id } = req.query
    let {name, bgcolor, icon} = req.body
    pool.getConnection((err, connection) => {
      connection.query(contentType.updatecontentType,[name, bgcolor, icon, id],(err, result) => {
        if(err){
          result = undefined;
          json(res, result);
        }else{
          res.send({
            code: 200,
            msg: '主题修改成功'
          })
        } 
         connection.release();
      })
    })
  },
  isdeleteContentType: (req, res) => { // 删除(恢复)主题 (用户，管理员)
    let { id, status } = req.query
    pool.getConnection((err, connection) => {
      connection.query(contentType.isdeletecontentType, [status, id], (err, result) => {
         if(err){
          result = undefined;
          json(res, result);
        }else{
        if(result){
          connection.query(content.isStopContentByTid,[status, id], (err, result) => {
            if(result){
              res.send({
                code: 200,
                msg: status === '0' ? '主题删除成功' : '主题恢复成功'
              })
            }
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
  allContentType: (req, res) => { // 查询所有主题 (管理员)
    let {status, nickName, per, page} = req.query;
    status = status || '%%'
    if(nickName === undefined){nickName = '%%'} else{nickName = `%${nickName}%`}
    pool.getConnection((err, connection) => {
      connection.query(contentType.getAllcontentType,[status, nickName], (err, result) => {
        if (err) {
          result = undefined;
           json(res, result);
        } else {
          let offset=parseInt(page || 1)
          let limit=parseInt(per || 8)
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
  todayContentType: (req, res) => {
    const date = moment(Date.now()).format('YYYY-MM-DD')
    pool.getConnection((err, connection) => {
      connection.query(contentType.todayAddContentType, [date, date],(err, result) => {
        if (err) {
          result = undefined;
          json(res, result)
          throw err;
        }
       else {
          if(result){
            let _result = {
              count: result[0].count,
              rate: ((result[0].rate)*100).toFixed(2),
              allCount: result[0].allCount
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
  }
}

module.exports =  contentTypeData 
