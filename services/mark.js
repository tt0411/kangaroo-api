let mysql = require("mysql");
let mysqlconfig = require("../config/mysql");
let poolextend = require("../modules/poolextend");
let { mark } = require("../modules/sql");
let json = require("../modules/json");
let pool = mysql.createPool(poolextend({}, mysqlconfig));
// const { getId } = require("../utils/utils");

let markData = {

  getMarkByCid: (req, res) => { // 根据文章id获取所有评论
    let { id } = req.query;
   if(id === undefined) {id = '1'} else{ id = id}
    pool.getConnection((err, connection) => {
      connection.query(mark.getMarkByCid, id, (err, result) => {
        if(err){
          result = undefined;
          json(res, result);
          throw err; 
        }else{
          res.send({
            code: 200,
            count: result.length,
            list: result
          })
        }
        connection.release();
      })
    })
  }
}

module.exports =  markData 
