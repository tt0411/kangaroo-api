let mysql = require("mysql");
let mysqlconfig = require("../config/mysql");
let poolextend = require("../modules/poolextend");
let { save } = require("../modules/sql");
let json = require("../modules/json");
let pool = mysql.createPool(poolextend({}, mysqlconfig));
// const { getId } = require("../utils/utils");

let saveData = {

  allSave: (req, res) => { // 查询所有收藏 (管理员)
    let {uid, context, status,  per, page} = req.query;
    status = status || '%%'
    uid = uid || '%%'
    if(context === undefined){context = '%%'} else{context = `%${context}%`}
    pool.getConnection((err, connection) => {
      connection.query(save.getAllSavesRoot,[context, uid, status], (err, result) => {
        if (err) {
          result = undefined;
           json(res, result);
           throw err;
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
  getSaveByCid : (req, res) => { // 获取文章的收藏数
    let {id} = req.query
    pool.getConnection((err, connection) => {
      connection.query(save.getSaveByCid, id, (err, result) => {
        if(err){
          result = undefined;
          json(res, result);
          throw err;
        }else{
          const _result = {
            count: result.length,
            code: 200,
            list: result
          }
          json(res, _result);
        }
        connection.release();
      })
    })
  
  }
}

module.exports =  saveData 
