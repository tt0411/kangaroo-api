// SQL语句封裝
const user = {
    login: 'SELECT * FROM user WHERE phone = ?',
    register: 'INSERT INTO user (phone, password) VALUES (?, ?)',
    rootLogin: 'SELECT * FROM rootuser WHERE phone = ?',
    rootRegister: 'INSERT INTO rootuser (phone, password, name) VALUES (?, ?, ?)',
    getRootName: 'SELECT name FROM rootuser WHERE id = ?',
    getUserInfo: 'SELECT * FROM user WHERE id = ?',
    updateUserInfo: 'UPDATE user SET nickName = ?, imgUrl = ?, age = ?, gender = ? WHERE id = ?',
    changeAvter: 'UPDATE user SET imgUrl = ? WHERE id = ?',
    changePhone: 'UPDATE user SET phone = ? WHERE id = ?',
    isStopUser: 'UPDATE user SET flag = ? WHERE id = ?',
    changeUserStatus: 'UPDATE user SET status = ? WHERE id = ?',
    totalUser: 'SELECT *, nickName as name FROM user where nickName like ? AND flag like ? AND status like ? AND gender like ? AND phone like ? AND type like ? ORDER BY create_time DESC',
    todayAddUser: 'SELECT * FROM user WHERE create_time >= ?',
    addTestUser: 'INSERT INTO user (nickName, phone, password, imgUrl, age, gender, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
    resetActive: 'UPDATE user SET active = 0 ',
    resetPwd: 'UPDATE user SET password = ? WHERE phone = ?',
    changeActive: 'UPDATE user SET active = active + ? WHERE id = ?',
    getActiveUser: 'SELECT * FROM user ORDER BY active DESC LIMIT 10',
    getGenderRate: `select COUNT(case when user.gender = '1' then gender end  ) AS maleCount,
     COUNT(case when user.gender = '2' then gender end  ) AS femaleCount, COUNT(case when 
     user.gender IN('1','2') then gender end) AS allCount, COUNT(case when user.gender = '1' 
     then gender end  )/COUNT(case when user.gender IN('1','2') then gender end) as maleRate,
     COUNT(case when user.gender = '2' then gender end )/COUNT(case when user.gender IN('1','2')
     then gender end) as femaleRate from  user `,
    getLiveRate: `select COUNT(case when user.status = '1' then status end  ) AS liveCount,
    COUNT(case when user.status = '0' then status end  ) AS restCount, COUNT(case when 
    user.status IN('0','1') then status end) AS allCount, COUNT(case when user.status = '1' 
    then status end  )/COUNT(case when user.status IN('1','0') then status end) as liveRate,
    COUNT(case when user.status = '0' then gender end )/COUNT(case when user.status IN('1','0')
    then status end) as restRate from  user `,
    getSevenDaysRegisterUser: `select a.click_date date,ifnull(b.count,0) as count
    from (
        SELECT curdate() as click_date
        union all
        SELECT date_sub(curdate(), interval 1 day) as click_date
        union all
        SELECT date_sub(curdate(), interval 2 day) as click_date
        union all
        SELECT date_sub(curdate(), interval 3 day) as click_date
        union all
        SELECT date_sub(curdate(), interval 4 day) as click_date
        union all
        SELECT date_sub(curdate(), interval 5 day) as click_date
        union all
        SELECT date_sub(curdate(), interval 6 day) as click_date
    ) a left join (
      select date(create_time) as datetime, count(*) as count
      from user
      group by date(create_time)
    ) b on a.click_date = b.datetime ORDER BY date`,
}

const contentType = {
    getAllcontentType: 'SELECT a.*, b.nickName, b.imgUrl FROM content_type a, user b WHERE a.uid = b.id AND a.status LIKE ? AND b.nickName LIKE ?',
    createcontentType: 'INSERT INTO content_type (name, bgcolor, icon, uid) VALUES (?, ?, ?, ?)',
    getcontentTypeByUid: 'SELECT * FROM content_type WHERE uid = ? ORDER BY create_time DESC',
    updatecontentType: 'UPDATE content_type SET name = ?, bgcolor = ?, icon = ? WHERE id = ?',  
    isdeletecontentType: 'UPDATE content_type SET status = ? WHERE id = ?',
    todayAddContentType: `SELECT  (SELECT count(*) FROM content_type WHERE create_time >= ? ) 
    AS count, (SELECT count(*) FROM content_type) AS allCount, (SELECT count(*) FROM content_type WHERE create_time >= ? )/(SELECT count(*) from 
    content_type) AS rate `
}
    
const content = {
    getcontentByTid: 'SELECT * FROM content WHERE tid = ? AND flag = 1 OR flag = 0 ORDER BY create_time DESC',
    createContent: 'INSERT INTO content (title, context, mood, img, status, tid) VALUES (?, ?, ?, ?, ?, ?)',
    getAllContents: 'SELECT * FROM content WHERE status = 1 AND flag = 1  ORDER BY create_time DESC',
    getAllContentsRoot: `SELECT a.*,b.name,c.nickName,c.imgUrl, c.id AS uid from content a, content_type b, user c WHERE a.tid = b.id AND b.uid = c.id AND a.mood LIKE ? AND a.flag LIKE ? AND a.status LIKE ? AND a.context LIKE ? AND c.nickName LIKE ? AND a.id LIKE ?`,
    getcontentByUid: 'SELECT * from content WHERE uid = ? AND flag = 1 OR flag = 0  ORDER BY create_time DESC',
    getcontentById: 'SELECT * from content WHERE id = ? ',
    isStopContent: 'UPDATE content SET flag = ? WHERE id = ?',
    isStopContentByTid: 'UPDATE content SET flag = ? WHERE tid = ? ',
    todayAddContent: 'SELECT * from content WHERE create_time >= ?',
    todayAddContentRate: `SELECT  (SELECT count(*) FROM content WHERE create_time >= ?) AS count,
    (SELECT count(*) FROM content WHERE create_time >= ? )/(SELECT count(*) from content) AS rate `,  
}

const comment = {
    getAllCommentsRoot: `SELECT a.*, b.context, c.nickName as comment_name, c.imgUrl as comment_imgUrl from 
    comment a, content b, user c WHERE  c.id = a.from_uid AND a.cid = b.id  AND a.content LIKE ? AND c.id LIKE ? 
    AND a.status like ? AND a.create_time >= ? AND a.create_time <= ?  `,
    isStopComment: 'UPDATE comment SET status = ? WHERE id = ?',
    getCommentByCid: `SELECT a.*, b.context,c.nickName as comment_name,c.imgUrl from comment a ,content b, user c WHERE 
    a.cid = b.id AND a.from_uid = c.id AND a.status = 1 AND b.id = ?`
}

const save = {
    getAllSavesRoot:`SELECT a.*,b.context,c.nickName as saver_name,c.imgUrl from save a, content b, user c 
    WHERE a.cid = b.id AND a.uid = c.id AND b.context LIKE ? AND a.uid LIKE ? AND a.status LIKE ?`,
    getSaveByCid: `SELECT a.*, b.context, c.nickName as saver_name,c.imgUrl from save a, content b, 
    user c WHERE a.cid = b.id AND a.uid = c.id AND b.id = ?`
}

const mark ={
    getMarkByCid: `SELECT a.*, b.context, c.nickName as marker_name,c.imgUrl from mark a, content b, 
    user c WHERE a.mark_id = b.id AND a.uid = c.id AND a.status = 1 AND b.id = ?`,
    getAllMarksRoot: `SELECT a.*,b.context,c.nickName as marker_name,c.imgUrl from mark a, content b, user c 
    WHERE a.mark_id = b.id AND a.uid = c.id AND b.context LIKE ? AND a.uid LIKE ? AND a.status LIKE ?`
}

module.exports = { user, contentType, content, comment, save, mark }