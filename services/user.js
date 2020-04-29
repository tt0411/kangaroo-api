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
const excel = require('node-excel-export');
let moment = require("moment");

const { getId, createToken, ACTIVE } = require("../utils/utils")
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

let userData = {
  login: (req, res) => {  // 用户登录
    pool.getConnection((err, connection) => {
      const { phone, password } = req.query;
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
                    msg: '登录成功',
                    flag,
                    id,
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
  register: (req, res) => { // 用户注册
    let { phone, password, nickName, age, gender,imgUrl } = req.query;
    imgUrl = imgUrl || 'https://i.loli.net/2019/11/04/PJSrydQFn3tN42p.png'
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
            connection.query(user.register, [phone, pwd, nickName, age, gender, imgUrl], (err, result)=>{
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
  rootLogin: (req, res) => {  // 管理员登录
    pool.getConnection((err, connection) => {
      const { phone, password } = req.query;
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
                name: result[0].name,
                id: result[0].id,
                img: result[0].img,
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
    const { phone, password, name } = req.query;
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
  updateNickname: (req, res) => { // 用户修改昵称
    let {nickName} = req.query;
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
        user.updateUserNickname,
        [nickName, +uid],
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
  updateGender: (req, res) => { // 用户修改性别
    let {gender} = req.query;
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
        user.updateUserGender,
        [gender, +uid],
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
  updateAge: (req, res) => { // 用户修改年龄
    let { age } = req.query;
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
        user.updateUserAge,
        [age, +uid],
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
  updateAvater: (req, res) => { // 用户修改头像
      const { imgUrl } = req.query
      const id = getId(req);
        if(!id){
          res.send({
            code: 301,
            msg: 'token无效',
            data: []
          })
          return 
      }
      pool.getConnection((err, connection) => {
        connection.query(user.changeAvater,[ imgUrl,id ], (err, result) =>{
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
    if(!id){
      res.send({
        code: 301,
        msg: 'token无效',
        data: []
      })
      return 
  }
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
  updateUserPwd: (req, res) => { // 用户修改密码
       const id = getId(req);
       if(!id){
        res.send({
          code: 301,
          msg: 'token无效',
          data: []
        })
        return 
    }
       let { oldPassword, newPassword } = req.query
       pool.getConnection((err, connection) => {
         connection.query(user.getPwd, id, (err, result) => {
           if(err){
            res.send({ 
              code: 101,
              msg: '操作失败'
            })
             throw err;
           }else{
             if(result.length > 0 && bcrypt.compareSync(oldPassword,result[0].password)){
               const newPwd = bcrypt.hashSync(newPassword,salt)
                connection.query(user.changePwd,[newPwd, id], (err, result) => {
                  if(result.affectedRows > 0){
                    res.send({ 
                      code: 200,
                      msg: '密码修改成功'
                    })
                  }else{
                    res.send({ 
                      code: 101,
                      msg: '操作失败'
                    })
                  }
                })
             }else{
              res.send({ 
                code: 102,
                msg: '旧密码错误'
              })
             }
           }
         })
       }) 
  },
  userResetPwd: (req, res) => { // 用户忘记密码重置密码
    let { newPassword, phone } = req.query
    pool.getConnection((err, connection) => {
    const newPwd = bcrypt.hashSync(newPassword,salt)
      connection.query(user.userResetPwd,[newPwd, phone], (err, result) => {
        if(result){
          res.send({ 
            code: 200,
            msg: '密码修改成功'
          })
        }else{
          res.send({ 
            code: 101,
            msg: '操作失败'
          })
        }
      })
    })
},
  totalUser: (req, res) => {  // 获取所有用户(管理员)
  let {per, page, nickName, flag, status, gender, phone, type} = req.query;
  if(nickName === undefined){nickName = '%%'} else{nickName = `%${nickName}%`}
   flag = flag || '%%'
   status = status || '%%'
   gender = gender || '%%'
   phone = phone || '%%'
   type = type || '%%'
  pool.getConnection((err, connection) => {
    connection.query(user.totalUser,[nickName, flag, status, gender, phone, type], (err, result) => {
      if(err){
        result = undefined;
        json(res, result);
        throw err;
      }else{
      let offset=parseInt(page || 1)
      let limit=parseInt(per || 10)
      let newArry=result.slice((offset-1)*limit, offset*limit)
      let hasmore=offset*limit > result.length ? false : true
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
  todayAddUser: (req, res) => { // 获取昨日增加用户(管理员)
    const {per, page } = req.query
    const date = moment(Date.now()).format('YYYY-MM-DD')
    // const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
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
        let hasmore=offset*limit > result.length ? false : true
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
    let { uid } = req.query 
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
      connection.query(user.getUserInfo, +id, (err, result) => {
        if (err) {
          result = undefined;
        } else {
          if (result.length !== 0) {
            let _result = result[0];
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
    if(!id){
      res.send({
        code: 301,
        msg: 'token无效',
      })
      return 
  }
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
    const { phone, password, imgUrl, age, gender, nickName } = req.query
    const type = 2;
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
            connection.query(user.addTestUser, [nickName, phone, pwd, imgUrl, age, gender, type], (err, result)=>{
              if(err){
                res.send({
                  code: 101,
                  msg: '添加失败'
                })
              }else if(result){
                res.send({
                  code: 200,
                  msg: '添加成功'
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
  resetPwd: (req, res) => { // 重置用户密码
    const {phone} = req.query;
    const password = '123456';
    const pwd = bcrypt.hashSync(password,salt)
    pool.getConnection((err, connection) => {
      connection.query(user.login, phone, (err, result) => {
            if(err){
               result = undefined;
               json(res, result);
               throw err;
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
                        msg: '重置成功,新密码为 123456'
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
  },
  userExcel : (req, res) => { // 导出用户信息excel(管理员)
    let {nickName, flag, status, gender, phone, type} = req.query;
    if(nickName === undefined){nickName = '%%'} else{nickName = `%${nickName}%`}
      flag = flag || '%%'
      status = status || '%%'
      gender = gender || '%%'
      phone = phone || '%%'
      type = type || '%%'
    pool.getConnection((err, connection) => {
      connection.query(user.totalUser,[nickName, flag, status, gender, phone, type], (err, result) => {
          if(err){
            res.send({
              code: 101,
              msg: '导出Excel失败'
            })
            throw err;
          }else{
            let dataset = []
            result.forEach(item => {
              dataset.push({ 
                name: item.name,
                imgUrl: item.imgUrl,
                phone: item.phone,
                age: item.age,
                create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
                status: item.status,
                flag: item.flag,
                type: item.type
              })
            })
            const styles = {
              headerDark: {
                fill: {
                  fgColor: {
                    rgb: 'ffffff'
                  }
                },
                font: {
                  color: {
                    rgb: '000000'
                  },
                  sz: 14,
                  bold: true,
                  underline: true
                }
              },
            };
            const heading = [['', '', ''] ];
            const specification = {
              name: { 
                displayName: '姓名', 
                headerStyle: styles.headerDark,
                width: 120 
              },
              imgUrl: {
                displayName: '头像地址',
                headerStyle: styles.headerDark,
                width: 300
              },
              phone: {
                displayName: '手机号',
                headerStyle: styles.headerDark,
                width: 100 
              },
              age: {
                displayName: '年龄',
                headerStyle: styles.headerDark,
                width: 50 
              },
              create_time: {
                displayName: '注册时间',
                headerStyle: styles.headerDark,
                width: 220 
              },
              status: {
                displayName: '在线状态',
                headerStyle: styles.headerDark,
                cellFormat: function(value, row) { 
                    return (value == 1) ? '在线' : '离线';
                  },
                width: 100 
              },
              flag: {
                displayName: '状态',
                headerStyle: styles.headerDark,
                cellFormat: function(value, row) { 
                    return (value == 1) ? '正常' : '禁用';
                  },
                width: 100 
              },
              type: {
                displayName: '用户类型',
                headerStyle: styles.headerDark,
                cellFormat: function(value, row) { 
                    return (value == 1) ? '正常注册用户' : '测试用户';
                  },
                width: 180 
              }
            }
            const report = excel.buildExport(
              [ 
                {
                  name: 'Report',
                  heading: heading, 
                  specification: specification, 
                  data: dataset
                }
              ]
            );
            
            res.attachment('用户信息表.xlsx'); 
            return res.send(report);
          }
       })
    })
  },
}


module.exports = userData
