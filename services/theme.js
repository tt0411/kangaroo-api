<<<<<<< HEAD
let mysql = require("mysql");
let mysqlconfig = require("../config/mysql");
let poolextend = require("../modules/poolextend");
let moment = require("moment");
let { theme, content, user } = require("../modules/sql");
let json = require("../modules/json");
let pool = mysql.createPool(poolextend({}, mysqlconfig));
const { getId, ACTIVE, formatTime } = require("../utils/utils");

let themeData = {
  createTheme: (req, res) => { //用户创建主题
    let {name, status, flag} = req.query
    const uid = getId(req);
    if(!uid){
      res.send({
        code: 301,
        msg: 'token无效',
        data: []
      })
      return 
  }
    pool.getConnection((err, connection) => {
      connection.query(
        theme.createtheme,
        [name, status,flag, +uid],
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
                    msg: '主题创建成功,活跃度',
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
  getThemeByUid: (req, res) => { // 用户获取自己创建的主题
    let { per, page, uid } = req.query 
    let tokenId = getId(req)
    let id = null;
    if(uid == 'undefined') {
      id = tokenId
    }else {
       id = uid
    }
    if(!id){
      res.send({
        code: 301,
        msg: '无效请求',
        data: []
      })
      return 
   }
    pool.getConnection((err, connection) => {
      connection.query(theme.getthemeByUid, +id, (err, result) => {
        if (err) {
          res.send({
            code: 101,
            msg: '查询失败'
          })
          throw err
        } else {
          if (result) {
            let offset=parseInt(page || 1)
            let limit=parseInt(per || 100)
            let newArray=result.slice((offset-1)*limit, offset*limit)
            let hasmore=offset+limit > result.length ? false : true
            let _newArray = []
             newArray.forEach(item => {
              _newArray.push({
                 id: item.id,
                 uid: item.uid,
                 name: item.name, 
                 create_time: formatTime(moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')),
                 update_time: moment(item.update_time).format('YYYY-MM-DD HH:mm:ss'),
                 flag: item.flag,
                 status: item.status,
                 nickName: item.nickName,
                 imgUrl: item.imgUrl,
              })
            })
            res.send({
              code: 200,
              count: result.length,
              msg: '查询成功',
              hasmore,
              data: _newArray
            })
          }else{
            res.send({
              code: 101,
              msg: '查询失败'
            })
          } 
        }
        connection.release();
      })
    })
  },
  getThemeById: (req, res) => { // 获取某个主题
      let { id } = req.query;
      pool.getConnection((err, connection) => {
        connection.query(theme.getThemeById, id, (err, result) => {
          if(err) {
            res.send({
              code: 101,
              msg: '主题获取失败'
            })
            throw err
          }else{
            if(result) {
             let _result = {
              id: result[0].id,
              name: result[0].name,
              create_time: formatTime(moment(result[0].create_time).format('YYYY-MM-DD HH:mm:ss')) ,
              nickName: result[0].nickName,
              imgUrl: result[0].imgUrl,
              }
              res.send({
                code: 200,
                msg: '获取成功',
                data: _result
              })
            }
          }
        })
      })
  },
  getThemeList : (req, res) => {  // 主题列表
    let uid = getId(req);
    if(!uid){
      res.send({
        code: 301,
        msg: 'token无效',
        data: []
      })
      return 
   }
    pool.getConnection((err, connection) => {
      connection.query(theme.getThemeList, uid, (err, result) => {
        if(err) {
          res.send({
            code: 101,
            msg: '获取主题列表失败'
          })
          throw err
        }else {
          if(result) {
             res.send({
               code: 200,
               data: result,
               count: result.length,
               msg: '主题列表获取成功'
             })
          }
        }
      })
    })
  },
  getOpenTheme: (req, res) => { // 获取所有公开主题
    let { per, page } = req.query
    pool.getConnection((err, connection) => {
      connection.query(theme.getOpenTheme, (err, result) => {
        if (err) {
          res.send({
            code: 101,
            msg: '查询失败'
          })
          throw err
        } else {
          if (result) {
            let offset=parseInt(page || 1)
            let limit=parseInt(per || 6)
            let newArray=result.slice((offset-1)*limit, offset*limit)
            let hasmore=offset+limit > result.length ? false : true
            let _newArray = []
             newArray.forEach(item => {
              _newArray.push({
                 id: item.id,
                 uid: item.uid,
                 name: item.name, 
                 create_time: formatTime(moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')),
                 update_time: moment(item.update_time).format('YYYY-MM-DD HH:mm:ss'),
                 flag: item.flag,
                 status: item.status,
                 nickName: item.nickName,
                 imgUrl: item.imgUrl,
              })
            })
            res.send({
              code: 200,
              count: result.length,
              msg: '查询成功',
              hasmore,
              data: _newArray
            })
          }else{
            res.send({
              code: 101,
              msg: '查询失败'
            })
          } 
        }
        connection.release();
      })
    })
  },
  updateTheme: (req, res) => { // 用户修改主题名称
    let { id, name } = req.query
    pool.getConnection((err, connection) => {
      connection.query(theme.updatetheme,[name, id],(err, result) => {
        if(err){
          res.code({
            code: 101,
            msg: '主题修改失败'
          })
          throw err
        }else{
          if(result) {
             res.send({
            code: 200,
            msg: '主题修改成功'
            })
          }
        } 
         connection.release();
      })
    })
  },
  isdeleteTheme: (req, res) => { // 审核主题 (管理员)
    let { id, flag, remark } = req.query
    pool.getConnection((err, connection) => {
      connection.query(theme.checktheme, [flag, remark, id], (err, result) => {
         if(err){
          result = undefined;
          json(res, result);
        }else{
          if(result) {
            res.send({
              code: 200,
              msg: '操作成功'
            })
          }else {
            res.send({
              code: 301,
              msg: '操作失败'
            })
          }
       } 
        connection.release();
     })
    })
  },
  allTheme: (req, res) => { // 查询所有主题 (管理员)
    let {status, nickName, per, page} = req.query;
    status = status || '%%'
    if(nickName === undefined){nickName = '%%'} else{nickName = `%${nickName}%`}
    pool.getConnection((err, connection) => {
      connection.query(theme.getAlltheme,[status, nickName], (err, result) => {
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
  todayTheme: (req, res) => { // 今日新增主题 (管理员)
     const date = moment(Date.now()).format('YYYY-MM-DD')
    // const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    pool.getConnection((err, connection) => {
      connection.query(theme.todayAddtheme, [date, date],(err, result) => {
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
  },
  waitThemeRoots: (req, res) => {
    let { per, page} = req.query;
    pool.getConnection((err, connection) => {
      connection.query(theme.waitThemeRoots, (err, result) => {
        if (err) {
          result = undefined;
           json(res, result);
        } else {
          let offset=parseInt(page || 1)
          let limit=parseInt(per || 1000)
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
  }
}

module.exports =  themeData 
=======
let mysql = require("mysql");
let mysqlconfig = require("../config/mysql");
let poolextend = require("../modules/poolextend");
let moment = require("moment");
let { theme, content, user } = require("../modules/sql");
let json = require("../modules/json");
let pool = mysql.createPool(poolextend({}, mysqlconfig));
const { getId, ACTIVE } = require("../utils/utils");

let themeData = {
  createTheme: (req, res) => { //用户创建主题
    let {name, status, flag} = req.query
    const uid = getId(req);
    if(!uid){
      res.send({
        code: 301,
        msg: 'token无效',
        data: []
      })
      return 
  }
    pool.getConnection((err, connection) => {
      connection.query(
        theme.createtheme,
        [name, status,flag, +uid],
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
  getThemeByUid: (req, res) => { // 用户获取自己创建的主题
    let { per, page, uid } = req.query 
    let tokenId = getId(req)
    let id = null;
    if(uid == 'undefined') {
      id = tokenId
    }else {
       id = uid
    }
    if(!id){
      res.send({
        code: 301,
        msg: '无效请求',
        data: []
      })
      return 
   }
    pool.getConnection((err, connection) => {
      connection.query(theme.getthemeByUid, +id, (err, result) => {
        if (err) {
          res.send({
            code: 101,
            msg: '查询失败'
          })
          throw err
        } else {
          if (result) {
            let offset=parseInt(page || 1)
            let limit=parseInt(per || 100)
            let newArray=result.slice((offset-1)*limit, offset*limit)
            let hasmore=offset+limit > result.length ? false : true
            let _newArray = []
             newArray.forEach(item => {
              _newArray.push({
                 id: item.id,
                 uid: item.uid,
                 name: item.name, 
                 create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
                 update_time: moment(item.update_time).format('YYYY-MM-DD HH:mm:ss'),
                 flag: item.flag,
                 status: item.status,
                 nickName: item.nickName,
                 imgUrl: item.imgUrl,
              })
            })
            res.send({
              code: 200,
              count: result.length,
              msg: '查询成功',
              hasmore,
              data: _newArray
            })
          }else{
            res.send({
              code: 101,
              msg: '查询失败'
            })
          } 
        }
        connection.release();
      })
    })
  },
  getThemeById: (req, res) => { // 获取某个主题
      let { id } = req.query;
      pool.getConnection((err, connection) => {
        connection.query(theme.getThemeById, id, (err, result) => {
          if(err) {
            res.send({
              code: 101,
              msg: '主题获取失败'
            })
            throw err
          }else{
            if(result) {
             let _result = {
              id: result[0].id,
              name: result[0].name,
              create_time: moment(result[0].create_time).format('YYYY-MM-DD HH:mm:ss') ,
              nickName: result[0].nickName,
              imgUrl: result[0].imgUrl,
              }
              res.send({
                code: 200,
                msg: '获取成功',
                data: _result
              })
            }
          }
        })
      })
  },
  getThemeList : (req, res) => {  // 主题列表
    let uid = getId(req);
    if(!uid){
      res.send({
        code: 301,
        msg: 'token无效',
        data: []
      })
      return 
   }
    pool.getConnection((err, connection) => {
      connection.query(theme.getThemeList, uid, (err, result) => {
        if(err) {
          res.send({
            code: 101,
            msg: '获取主题列表失败'
          })
          throw err
        }else {
          if(result) {
             res.send({
               code: 200,
               data: result,
               count: result.length,
               msg: '主题列表获取成功'
             })
          }
        }
      })
    })
  },
  getOpenTheme: (req, res) => { // 获取所有公开主题
    let { per, page } = req.query
    pool.getConnection((err, connection) => {
      connection.query(theme.getOpenTheme, (err, result) => {
        if (err) {
          res.send({
            code: 101,
            msg: '查询失败'
          })
          throw err
        } else {
          if (result) {
            let offset=parseInt(page || 1)
            let limit=parseInt(per || 6)
            let newArray=result.slice((offset-1)*limit, offset*limit)
            let hasmore=offset+limit > result.length ? false : true
            let _newArray = []
             newArray.forEach(item => {
              _newArray.push({
                 id: item.id,
                 uid: item.uid,
                 name: item.name, 
                 create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
                 update_time: moment(item.update_time).format('YYYY-MM-DD HH:mm:ss'),
                 flag: item.flag,
                 status: item.status,
                 nickName: item.nickName,
                 imgUrl: item.imgUrl,
              })
            })
            res.send({
              code: 200,
              count: result.length,
              msg: '查询成功',
              hasmore,
              data: _newArray
            })
          }else{
            res.send({
              code: 101,
              msg: '查询失败'
            })
          } 
        }
        connection.release();
      })
    })
  },
  updateTheme: (req, res) => { // 用户修改主题名称
    let { id, name } = req.query
    pool.getConnection((err, connection) => {
      connection.query(theme.updatetheme,[name, id],(err, result) => {
        if(err){
          res.code({
            code: 101,
            msg: '主题修改失败'
          })
          throw err
        }else{
          if(result) {
             res.send({
            code: 200,
            msg: '主题修改成功'
            })
          }
        } 
         connection.release();
      })
    })
  },
  isdeleteTheme: (req, res) => { // 审核主题 (管理员)
    let { id, flag, remark } = req.query
    pool.getConnection((err, connection) => {
      connection.query(theme.checktheme, [flag, remark, id], (err, result) => {
         if(err){
          result = undefined;
          json(res, result);
        }else{
          if(result) {
            res.send({
              code: 200,
              msg: '操作成功'
            })
          }else {
            res.send({
              code: 301,
              msg: '操作失败'
            })
          }
       } 
        connection.release();
     })
    })
  },
  allTheme: (req, res) => { // 查询所有主题 (管理员)
    let {status, nickName, per, page} = req.query;
    status = status || '%%'
    if(nickName === undefined){nickName = '%%'} else{nickName = `%${nickName}%`}
    pool.getConnection((err, connection) => {
      connection.query(theme.getAlltheme,[status, nickName], (err, result) => {
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
  todayTheme: (req, res) => { // 今日新增主题 (管理员)
    const date = moment(Date.now()).format('YYYY-MM-DD')
    pool.getConnection((err, connection) => {
      connection.query(theme.todayAddtheme, [date, date],(err, result) => {
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
  },
  waitThemeRoots: (req, res) => {
    let { per, page} = req.query;
    pool.getConnection((err, connection) => {
      connection.query(theme.waitThemeRoots, (err, result) => {
        if (err) {
          result = undefined;
           json(res, result);
        } else {
          let offset=parseInt(page || 1)
          let limit=parseInt(per || 1000)
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
  }
}

module.exports =  themeData 
>>>>>>> master
