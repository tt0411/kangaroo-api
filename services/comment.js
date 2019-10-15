let mysql = require("mysql");
let mysqlconfig = require("../config/mysql");
let poolextend = require("../modules/poolextend");
let moment = require("moment");
let { comment } = require("../modules/sql");
let json = require("../modules/json");
let pool = mysql.createPool(poolextend({}, mysqlconfig));
// const { getId } = require("../utils/utils");

let commentData = {

  allComment: (req, res) => { // 查询所有评论 (管理员)
    let {from_uid, content, status, start_date, end_date, per, page} = req.query;
    status = status || '%%'
    from_uid = from_uid || '%%'
    start_date = start_date || '2019-01-01'
    end_date = end_date || moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    if(content === undefined){content = '%%'} else{content = `%${content}%`}
    pool.getConnection((err, connection) => {
      connection.query(comment.getAllCommentsRoot,[content, from_uid, status, start_date, end_date], (err, result) => {
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
  isStopComment: (req, res) => { // 封禁，解封评论 (管理员)
    const { id, status } = req.query;
    pool.getConnection((err, connection) => {
      connection.query(comment.isStopComment, [status, id], (err, result) => {
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
  }
}

module.exports =  commentData 
