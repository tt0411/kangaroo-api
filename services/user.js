// 引入mysql
let mysql = require("mysql");
// 引入mysql连接配置
let mysqlconfig = require("../config/mysql");
// 引入连接池配置
let poolextend = require("../modules/poolextend");
// 引入SQL模块
let { user } = require("../modules/sql");
// 引入json模块
let json = require("../modules/json");
// 使用连接池，提升性能
let pool = mysql.createPool(poolextend({}, mysqlconfig));
let moment = require("moment");

const { getId, createToken, ACTIVE } = require("../utils/utils")
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

let userData = {
  login: (req, res) => {  // 登录
    pool.getConnection((err, connection) => {
      const { phone, password } = req.body;
      connection.query(user.login, phone, (err, result) => {
        if (err) {
          result = undefined;
          json(res, result);
        } else if(result.length >0) { 
          if (bcrypt.compareSync(password,result[0].password)) {
            const { id, flag } = result[0];
            if(flag === 0){
              res.send({
                code: 100,
                flag,
                msg: '此账号被禁用'
              })
            }else{
              connection.query(user.changeActive, [ACTIVE.LOGIN_ACTIVE, id], (err, result) => {
                if(err){
                  result = undefined
                }else{
                  res.send({
                    code: 200,
                    msg: '登录成功,活跃度 +'+ACTIVE.LOGIN_ACTIVE,
                    flag,
                    token: createToken(id)
                  })
                }
              }) 
              connection.query(user.changeUserStatus, [1, id], (err, result) => {
                if(err){
                 throw err;
                }
              }) 
            }
          } else {
            res.send({
              code: -1,
              msg: "登录失败"
            });
          }
        } else {
          res.send({
            code: -1,
            msg: "登录失败"
          });
        }
      });
      connection.release();
    });
  },
  rootLogin: (req, res) => {  // 管理员登录
    pool.getConnection((err, connection) => {
      const { phone, password } = req.body;
      connection.query(user.rootLogin, phone, (err, result) => {
        if (err) {
          result = undefined;
          json(res, result);
          throw err;
        } else if(result.length >0){
          if (bcrypt.compareSync(password,result[0].password)) {
              res.send({
                code: 200,
                msg: '登录成功',
                name: result[0].name
              })
          } else {
            res.send({
              code: -1,
              msg: "登录失败"
            });
          }
        }else{
          res.send({
            code: -1,
            msg: "登录失败"
          });
        }
      });
      connection.release();
    });
  },
  rootRegister: (req, res) => { // 管理员注册
    const { phone, password, name } = req.body;
    pool.getConnection((err, connection) => {
       connection.query(user.rootLogin, phone, (err, result) => {
        if(err){
          res.send({
            code: 101,
            msg: '操作失败'
          })
          throw err
        }else {
        if(result.length === 0){
          const pwd = bcrypt.hashSync(password,salt)
            connection.query(user.rootRegister, [phone, pwd, name], (err, result)=>{
              if(err){
                res.send({
                  code: 101,
                  msg: '注册失败'
                })
                throw err;
              }else if(result){
                res.send({
                  code: 200,
                  msg: '注册成功'
                })
              }
            })
         } else{
          res.send({
            code: 102,
            msg: '此账号已被注册'
          })
         }  
        }      
      })
       connection.release();
    })     
  },
  register: (req, res) => { // 用户注册
    const { phone, password } = req.body;
    pool.getConnection((err, connection) => {
       connection.query(user.login, phone, (err, result) => {
        if(err){
          res.send({
            code: 101,
            msg: '操作失败'
          })
          throw err
        }else {
        if(result.length === 0){
          const pwd = bcrypt.hashSync(password,salt)
            connection.query(user.register, [phone, pwd], (err, result)=>{
              if(err){
                res.send({
                  code: 101,
                  msg: '注册失败'
                })
              }else if(result){
                res.send({
                  code: 200,
                  msg: '注册成功'
                })
              }
            })
         } else{
          res.send({
            code: 102,
            msg: '此账号已被注册'
          })
         }  
        }      
      })
       connection.release();
    })     
  },
  updateUserInfo: (req, res) => { // 用户修改个人信息
    let param = req.body;
    const uid = getId(req);
    pool.getConnection((err, connection) => {
      connection.query(
        user.updateUserInfo,
        [param.nickName, param.imgUrl, param.age, param.gender, +uid],
        (err, result) => {
          if (err) {
            result = undefined;
          } else {
            if (result.affectedRows > 0) {
              result = "update";
            } else {
              result = undefined;
            }
          }
          json(res, result);
          connection.release();
        }
      );
    });
  },
  updateUserAvter: (req, res) => { // 用户修改头像
      const { imgUrl } = req.body
      const id = getId(req);
      pool.getConnection((err, connection) => {
        connection.query(user.changeAvter,[ imgUrl,id ], (err, result) =>{
          if(err){
            result = undefined;
          }else{
            if(result.affectedRows > 0){
              result = "update"
            }else{
              result = undefined;
            }
          }
          json(res, result);
          connection.release();
        })
      })
  },
  updateUserPhone: (req, res) => { // 用户修改手机(登录账号)
    const { phone } = req.body
    const id = getId(req);
    pool.getConnection((err, connection) => {
      connection.query(user.changePhone,[ phone, id ], (err, result) =>{
        if(err){
          result = undefined;
          throw err;
        }else{
          if(result.affectedRows > 0){
            result = "update"
          }else{
            result = undefined;
          }
        }
        json(res, result);
        connection.release();
      })
    })
},
totalUser: (req, res) => {  // 获取所有用户(管理员)
  let {per, page, nickName, flag, status, gender, phone} = req.query;
  //  nickName == undefined ? '%%' : `%${nickName}%`
  if(nickName === undefined){nickName = '%%'} else{nickName = `%${nickName}%`}
   flag = flag || '%%'
   status = status || '%%'
   gender = gender || '%%'
   phone = phone || '%%'
  pool.getConnection((err, connection) => {
    connection.query(user.totalUser,[nickName, flag, status, gender, phone], (err, result) => {
      if(err){
        result = undefined;
        json(res, result);
        throw err;
      }else{
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
  todayAddUser: (req, res) => { // 获取今日增加用户(管理员)
    const {per, page } = req.query
    const date = moment(Date.now()).format('YYYY-MM-DD')
    pool.getConnection((err, connection) => {
      connection.query(user.todayAddUser, date,(err, result) => {
        if (err) {
          result = undefined;
          json(res, result)
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
  getInfo: (req, res) => { // 用户获取个人信息
    const id = getId(req) || req.query.id;
    pool.getConnection((err, connection) => {
      connection.query(user.getUserInfo, id, (err, result) => {
        if (err) {
          result = undefined;
        } else {
          if (result.length !== 0) {
            let _result = result;
            result = {
              result: "select",
              data: _result,
              code: 200
            };
          } else {
            result = undefined;
          }
        }

        json(res, result);
        connection.release();
      })
    })
  },
  logout: (req, res) => { // 用户退出登录
    const id = getId(req);
    pool.getConnection((err, connection) => {
      connection.query(user.changeUserStatus, [0, id], (err, result) => {
        if(err){
          result = undefined;
          json(res, result);
        }else{
          if(result){
            res.send({
              code: 200,
              msg: '退出成功'
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
  isStopUser: (req, res) => { // 禁用启用用户(管理员)
    const { id, flag } = req.query;
    pool.getConnection((err, connection) => {
      connection.query(user.isStopUser, [flag, id], (err, result) => {
        if(err){
          result = undefined;
          json(res, result);
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
  addTestUser: (req, res) => { // 添加测试账号(管理员)
    const { phone, password, imgUrl, age, gender } = req.body
    pool.getConnection((err, connection) => {
      connection.query(user.addTestUser, [phone, password, imgUrl, age, gender], (err, result) => {
        if(err){
          result = undefined;
          json(res, result);
        }else{
          if(result){
            res.send({
              code: 200,
              msg: '添加成功'
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
  resetActive: (req, res) => { // 重置用户活跃度(定时任务)
    pool.getConnection((err, connection) => {
      connection.query(user.resetActive, (err, result) => {
        if(err){
          result = undefined;
          json(res, result);
        }else{
          if(result){
            res.send({
              code: 200,
              msg: '重置成功'
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
  getActiveUsers: (req, res) => { // 获取当日用户活跃排行榜
    pool.getConnection((err, connection) => {
      connection.query(user.getActiveUser, (err, result) => {
        if(err){
          result = undefined;
        }else{
          let _result = result;
          result = {
            result: "select",
            data: _result,
            code: 200
          }
        }
        json(res, result);
        connection.release();
      })
    })
  },
  getGenderRate: (req, res) => { // 获取用户男女比例(管理员)
    pool.getConnection((err, connection) => {
      connection.query(user.getGenderRate, (err, result) => {
        if(err){
          result = undefined;
        }else{
          let _result = [
            {
              sex: '男',
              count: result[0].maleCount,
              sold: result[0].maleRate
            },
            {
              sex: '女',
              count: result[0].femaleCount,
              sold: result[0].femaleRate
            }
          ]
          
          result = {
            result: "select",
            data: _result,
            code: 200
          }
        }
        json(res, result);
        connection.release();
      })
    })
  },
  getLiveRate: (req, res) => { // 获取在线离线比例(管理员)
    pool.getConnection((err, connection) => {
      connection.query(user.getLiveRate, (err, result) => {
        if(err){
          result = undefined;
        }else{
          let _result = [
            {
              status: '在线',
              count: result[0].liveCount,
              sold: result[0].liveRate
            },
            {
              status: '离线',
              count: result[0].restCount,
              sold: result[0].restRate
            }
          ]
          result = {
            result: "select",
            data: _result,
            code: 200
          }
        }
        json(res, result);
        connection.release();
      })
    })
  },
  getSevenDaysRegisterUser: (req, res) => { // 获取近七天增长用户
    pool.getConnection((err, connection) => {
      connection.query(user.getSevenDaysRegisterUser, (err, result) => {
        if(err){
          result = undefined;
          throw err;
        }else{
          let _result = [];
          result.forEach(item => {
            _result.push({
              date: moment(item.date).format('MM月DD日'), 
              count: item.count
            })
          });
          result = {
            result: "select",
            data: _result
          }
        }
        json(res, result);
        connection.release();
      })
    })
  },
  resetPwd: (req, res) => { // 用户重置密码
    const {phone} = req.query;
    const password = '123456';
    const pwd = bcrypt.hashSync(password,salt)
    pool.getConnection((err, connection) => {
      connection.query(user.login, phone, (err, result) => {
            if(err){
               result = undefined;
               json(res, result);
            }else{
              if(result.length === 0){
                res.send({
                   code: 101,
                   msg: '此账号不存在'
                })
              }else{
                connection.query(user.resetPwd,[pwd, phone], (err, result) => {
                  if(err){
                    result = undefined;
                    json(res, result);
                    throw err;
                  }else{
                    if(result){
                      res.send({
                        code: 200,
                        msg: '重置成功,新密码为123456'
                      })
                    }else{
                      result = undefined;
                      json(res, result);
                    }
                  }
                  connection.release();
                })
            }
         }
      })
    })
  }
}


module.exports = userData
