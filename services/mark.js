let mysql = require("mysql");
let mysqlconfig = require("../config/mysql");
let poolextend = require("../modules/poolextend");
let moment = require("moment")
let { mark } = require("../modules/sql");
let json = require("../modules/json");
let pool = mysql.createPool(poolextend({}, mysqlconfig));
// const { getId } = require("../utils/utils");

let markData = {
  allMark: (req, res) => {
    // 查询所有收藏 (管理员)
    let { uid, context, status, per, page } = req.query;
    status = status || "%%";
    uid = uid || "%%";
    if (context === undefined) {
      context = "%%";
    } else {
      context = `%${context}%`;
    }
    pool.getConnection((err, connection) => {
      connection.query(
        mark.getAllMarksRoot,
        [context, uid, status],
        (err, result) => {
          if (err) {
            result = undefined;
            json(res, result);
            throw err;
          } else {
            let offset = parseInt(page || 1);
            let limit = parseInt(per || 8);
            let newArry = result.slice((offset - 1) * limit, offset * limit);
            let hasmore = offset + limit > result.length ? false : true;
            const _result = {
              hasmore,
              list: newArry,
              count: result.length,
              code: 200
            };
            json(res, _result);
          }
          connection.release();
        }
      );
    });
  },
  getMarkByCid: (req, res) => {
    // 根据文章id获取所有点赞
    let { id, per, page } = req.query;
    pool.getConnection((err, connection) => {
      connection.query(mark.getMarkByCid, id, (err, result) => {
        if (err) {
          result = undefined;
          json(res, result);
          throw err;
        } else {
          let offset=parseInt(page || 1)
          let limit=parseInt(per || 5)
          let newArry=result.slice((offset-1)*limit, offset*limit)
          let _newArry = [];
          newArry.forEach(item => {
            _newArry.push({
              id: item.id,
              cid: item.mark_id,
              uid: item.uid,
              create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
              status: item.status,
              nickName: item.nickName,
              imgUrl: item.imgUrl,
            })
          })
          let hasmore = offset+limit > result.length ? false : true
          res.send({
            code: 200,
            count: result.length,
            list: _newArry,
            hasmore
          })
        }
        connection.release();
      });
    });
  }
};

module.exports = markData;
