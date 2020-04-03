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
    const { context, status, img, address, video, audio, flag, is_comment, tid} = req.query;
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
      connection.query(
        content.createContent,
        [context, img, video, audio, address,flag, status, is_comment, tid],
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
                    msg: '内容发表成功',
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
    let {per, page, limitCount} = req.query 
    limitCount = limitCount || 1000;
    pool.getConnection((err, connection) => {
      connection.query(content.getAllContents, +limitCount, (err, result) => {
        if (err) {
          result = undefined; 
          throw err;
        }
       else {
        let offset=parseInt(page || 1)
        let limit=parseInt(per || 10)
        let newArry=result.slice((offset-1)*limit, offset*limit)
        let _newArry = [];
        newArry.forEach(item => {
           _newArry.push({
             img: item.img ? item.img.split(',') : item.img,
             id: item.id,
             tid: item.tid,
             context: item.context, 
             flag: item.flag,
             status: item.status,
             create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
             name: item.name,
             address: item.address,
             nickName: item.nickName,
             is_comment: item.is_comment,
             imgUrl: item.imgUrl,
             video: item.video,
             audio: item.audio,
             uid: item.uid,
             comment: item.commentCount,
             mark: item.markCount,
             save: item.saveCount
           })
        })   
        let hasmore=offset+limit > result.length ? false : true
        const _result = {
            hasmore,
            count: result.length,
            list: _newArry,
            code: 200,
        }
        json(res, _result);
       }
       connection.release();
      })
    })
  },
  getMyMarkContent: (req, res) => { // 获取用户喜欢(点赞)内容
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
      connection.query(content.getMyMarkContent, +id, (err, result) => {
        if (err) {
          result = undefined; 
          throw err;
        }
       else {
        let offset=parseInt(page || 1)
        let limit=parseInt(per || 10)
        let newArry=result.slice((offset-1)*limit, offset*limit)
        let _newArry = [];
        newArry.forEach(item => {
           _newArry.push({
             img: item.img ? item.img.split(',') : item.img,
             id: item.id,
             tid: item.tid,
             context: item.context, 
             flag: item.flag,
             status: item.status,
             create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
             name: item.name,
             address: item.address,
             nickName: item.nickName,
             is_comment: item.is_comment,
             imgUrl: item.imgUrl,
             video: item.video,
             audio: item.audio,
             uid: item.uid,
             comment: item.commentCount,
             mark: item.markCount,
             save: item.saveCount
           })
        })   
        let hasmore=offset+limit > result.length ? false : true
        const _result = {
            hasmore,
            count: result.length,
            list: _newArry,
            code: 200,
        }
        json(res, _result);
       }
      
       connection.release();
      })
    })
  },
  getMySaveContent: (req, res) => { // 获取用户收藏内容
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
      connection.query(content.getMySaveContent, +id, (err, result) => {
        if (err) {
          result = undefined; 
          throw err;
        }
       else {
        let offset=parseInt(page || 1)
        let limit=parseInt(per || 10)
        let newArry=result.slice((offset-1)*limit, offset*limit)
        let _newArry = [];
        newArry.forEach(item => {
           _newArry.push({
             img: item.img ? item.img.split(',') : item.img,
             id: item.id,
             tid: item.tid,
             context: item.context, 
             flag: item.flag,
             status: item.status,
             create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
             name: item.name,
             address: item.address,
             nickName: item.nickName,
             is_comment: item.is_comment,
             imgUrl: item.imgUrl,
             video: item.video,
             audio: item.audio,
             uid: item.uid,
             comment: item.commentCount,
             mark: item.markCount,
             save: item.saveCount
           })
        })   
        let hasmore=offset+limit > result.length ? false : true
        const _result = {
            hasmore,
            count: result.length,
            list: _newArry,
            code: 200,
        }
        json(res, _result);
       }
      
       connection.release();
      })
    })
  },
  getAllContentsRoot: (req, res) => { // 管理员查看所有内容(包含不公开，以及违规内容)
    let {per, page,  flag, status, name, nickName, id} = req.query
    flag = flag || '%%'
    status = status || '%%'
    id = id || '%%'
    if(name === undefined){name = '%%'} else{name = `%${name}%`}
    if(nickName === undefined){nickName = '%%'} else{nickName = `%${nickName}%`}
    pool.getConnection((err, connection) => {
      connection.query(content.getAllContentsRoot,[ flag, status, name, nickName, id], (err, result) => {
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
             img:item.img ? item.img.split(',') : '',
             id: item.id,
             tid: item.tid,
             context: item.context, 
             flag: item.flag,
             status: item.status,
             create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
             name: item.name,
             nickName: item.nickName,
             imgUrl: item.imgUrl,
             video: item.video,
             audio: item.audio,
             uid: item.uid,
             remark: item.remark,
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
  getOpencontentByTid: (req, res) => { // 用户获取某一公开主题下的内容
    let { tid, page, per } = req.query;
    pool.getConnection((err, connection) => {
      connection.query(content.getOpencontentByTid, tid, (err, result) => {
        if (err) {
          result = undefined;
          throw err;
        } else {
          let offset=parseInt(page || 1)
          let limit=parseInt(per || 1000)
          let newArry=result.slice((offset-1)*limit, offset*limit)
          let _newArry = [];
          newArry.forEach(item => {
             _newArry.push({
               img: item.img ? item.img.split(',') : item.img,
               id: item.id,
               tid: item.tid,
               context: item.context, 
               flag: item.flag,
               status: item.status,
               create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
               name: item.name,
               nickName: item.nickName,
               avatar: item.imgUrl,
               video: item.video,
               audio: item.audio,
               address: item.address,
               is_comment: item.is_comment,
               uid: item.uid,
               comment: item.commentCount,
               mark: item.markCount,
               save: item.saveCount
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
  getMycontentByTid: (req, res) => { // 用户获取自己主题下的内容
    let { tid, page, per } = req.query;
    pool.getConnection((err, connection) => {
      connection.query(content.getMycontentByTid, tid, (err, result) => {
        if (err) {
          result = undefined;
          throw err;
        } else {
          let offset=parseInt(page || 1)
          let limit=parseInt(per || 10)
          let newArry=result.slice((offset-1)*limit, offset*limit)
          let _newArry = [];
          newArry.forEach(item => {
             _newArry.push({
               img: item.img ? item.img.split(',') : item.img,
               id: item.id,
               tid: item.tid,
               context: item.context, 
               flag: item.flag,
               status: item.status,
               create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
               name: item.name,
               nickName: item.nickName,
               avatar: item.imgUrl,
               video: item.video,
               audio: item.audio,
               address: item.address,
               is_comment: item.is_comment,
               uid: item.uid,
               comment: item.commentCount,
               mark: item.markCount,
               save: item.saveCount
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
  getContentByUid: (req, res) => { // 用户获取所有发表的内容
    let {per, page, status} = req.query
    let uid = getId(req)
    let option = []
    if(!uid){
      res.send({
        code: 301,
        msg: 'token无效',
        data: []
      })
      return 
   }
   if(status == 9) { // 全部
      option = ['%%', '%%', uid]
   }else if(status == 0) { // 待审核
      option = [1, 0, uid]
   }else if(status == 1) { // 审核通过
      option = [1, 1, uid]
   }else if(status == 2) { // 审核不通过
      option = [1, 2, uid]
   }else if(status == 3) { // 不公开
     option = [0, 3, uid]
  }
    pool.getConnection((err, connection) => {
      connection.query(content.getcontentByUid, option, (err, result) => {
        if (err) {
          result = undefined;
          throw err;
        } else {
          let offset=parseInt(page || 1)
          let limit=parseInt(per || 1000)
          let newArry=result.slice((offset-1)*limit, offset*limit)
          let _newArry = [];
          newArry.forEach(item => {
            if(item.status != 2) {
              _newArry.push({
               img: item.img ? item.img.split(',') : item.img,
               id: item.id,
               tid: item.tid,
               context: item.context, 
               flag: item.flag,
               status: item.status,
               create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
               name: item.name,
               nickName: item.nickName,
               avatar: item.imgUrl,
               video: item.video,
               audio: item.audio,
               uid: item.uid,
               remark: item.remark,
             })
            }
          })   
          let hasmore=offset+limit > result.length ? false : true
          const _result = {
              hasmore,
              count: _newArry.length,
              list: _newArry,
              code: 200
          }
          json(res, _result);
        }
        connection.release();
      })
    })
  },
  getcontentCountByUid: (req, res) => { // 用户获取发表内容数量
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
      connection.query(content.getcontentCountByUid, +id, (err, result) => {
        if (err) {
          result = undefined;
          throw err;
        } else {
          const _result = {
              count: result.length,
              code: 200
          }
          json(res, _result);
        }
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
          throw err;
        } else {
          if (result) {
            let _result = {
              img: result[0].img ? result[0].img.split(',') : '',
              id: result[0].id,
              tid: result[0].tid,
              context: result[0].context, 
              flag: result[0].flag,
              status: result[0].status,
              create_time: moment(result[0].create_time).format('YYYY-MM-DD HH:mm:ss'),
              name: result[0].name,
              nickName: result[0].nickName,
              imgUrl: result[0].imgUrl,
              video: result[0].video,
              audio: result[0].audio,
              is_comment: result[0].is_comment,
              uid: result[0].uid,
              comment: result[0].commentCount,
              mark: result[0].markCount,
              save: result[0].saveCount
            };
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
  isDelContent: (req, res) => { // 用户删除内容
    let { id, status } = req.query;
    status = status || 2
    pool.getConnection((err, connection) => {
      connection.query(content.isDelContent, [status, id], (err, result) => {
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
  isStopContent: (req, res) => { // 审核内容(管理员)
    const { id, remark, flag } = req.query;
    pool.getConnection((err, connection) => {
      connection.query(content.isStopContent, [flag, remark, id], (err, result) => {
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
  waitContentRoots: (req, res) => { // 待审核内容(管理员移动端)
    let {per, page} = req.query;
    pool.getConnection((err, connection) => {
      connection.query(content.waitContentRoots, (err, result) => {
        if (err) {
          result = undefined; 
          json(res, result);
        }
       else {
        let offset=parseInt(page || 1)
        let limit=parseInt(per || 1000)
        let newArry=result.slice((offset-1)*limit, offset*limit)
        let _newArry = [];
        newArry.forEach(item => {
           _newArry.push({
             img:item.img ? item.img.split(',') : '',
             id: item.id,
             tid: item.tid,
             context: item.context, 
             flag: item.flag,
             status: item.status,
             create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
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
  waitDealCount: (req, res) => { // 待审核内容和主题数量(管理员移动端)
    pool.getConnection((err, connection) => {
      connection.query(content.waitCount,(err, result) => {
        if (err) {
          result = undefined;
          json(res, result)
          throw err;
        }
       else {
          if(result){
            res.send({
              code: 200,
              themeCount: result[0].themeCount,
              contentCount: result[0].contentCount,
              allCount: result[0].themeCount + result[0].contentCount,
            })
          }
       }
        connection.release();
      })
    })

  }
}

module.exports =  contentData 
