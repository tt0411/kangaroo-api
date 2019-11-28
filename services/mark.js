let mysql = require("mysql");
let mysqlconfig = require("../config/mysql");
let poolextend = require("../modules/poolextend");
let moment = require("moment")
let { mark } = require("../modules/sql");
let json = require("../modules/json");
let pool = mysql.createPool(poolextend({}, mysqlconfig));
const { getId } = require("../utils/utils");

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
          let limit=parseInt(per || 100)
          let newArry=result.slice((offset-1)*limit, offset*limit)
          let _newArry = [];
          newArry.forEach(item => {
            _newArry.push({
              id: item.id,
              cid: item.mark_id,
              uid: item.uid,
              create_time: moment(item.updatetime).format('YYYY-MM-DD HH:mm:ss'),
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
      })
    })
  },
  isMarkContent: (req, res) => { //点赞与取消点赞
    let {cid, status } = req.query
    let id = getId(req)
    if(!id){
      res.send({
        code: 301,
        msg: 'token无效',
      })
      return 
    }
    pool.getConnection((err, connection) => {
      connection.query(mark.isFirstMark, [id, cid], (err, result) => {
            if(err){
              res.send({
                code: 500,
                msg: '服务器错误'
              })
              throw err
            }else if(result.length > 0){
              connection.query(mark.isMarkContent,[status, id, cid], (err, result) => {
                if(err){
                  res.send({
                    code: 500,
                    msg: '服务器错误'
                  })
                  throw err
                }else{
                  res.send({
                    code: 200,
                    msg: status == 1 ? '点赞成功' : '取消点赞'
                  })
                }
              })
            }else{
              connection.query(mark.firstMarkContent,[id, cid, status], (err, result) => {
                if(err){
                  res.send({
                    code: 500,
                    msg: '服务器错误'
                  })
                  throw err
                }else{
                  res.send({
                    code: 200,
                    msg: '点赞成功 +5'
                  })
                }
              })
            }
            connection.release();
       })
    })  
  },
  markSign: (req, res) => { // 判断某一内容是否标记喜欢
    let { cid } = req.query
    let id = getId(req)
    if(!id){
      res.send({
        code: 301,
        msg: 'token无效',
      })
      return 
    }
    pool.getConnection((err, connection) => {
      connection.query(mark.isFirstMark, [id, cid], (err, result) => {
            if(err){
              res.send({
                code: 500,
                msg: '服务器错误'
              })
              throw err
            }else if(result.length > 0){
               if(result[0].status == 1){
                 res.send({
                   code: 200,
                   sign: true,
                   msg: '已标记喜欢'
                 })
               }else{
                res.send({
                  code: 200,
                  sign: false,
                  msg: '未标记喜欢'
                })
               }
            }else{
              res.send({
              code: 200,
              sign: false,
              msg: '未标记喜欢'
             })
            }
            connection.release();
          })
        })
    },
    getMarkByUid : (req, res) => { //用户获得的点赞
      let id = getId(req)
      if(!id){
        res.send({
          code: 301,
          msg: 'token无效',
        })
        return 
      }
      pool.getConnection((err, connection) => {
        connection.query(mark.getMarkByUid, id, (err, result) => {
          if(err){
            res.send({
              code: 500,
              msg: '服务器错误',
            })
            throw err
          }else{
            res.send({
              code: 200,
              count: result.length,
            })
          } 
           connection.release();
        })
      })
    }
}

module.exports = markData;
