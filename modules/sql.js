// SQL语句封裝
const user = {
  login: "SELECT * FROM user WHERE phone = ?",
  register:
    "INSERT INTO user (phone, password, nickName, age, gender, imgUrl) VALUES (?, ?, ?, ?, ?, ?)",
  rootLogin: "SELECT * FROM rootuser WHERE phone = ?",
  rootRegister: "INSERT INTO rootuser (phone, password, name) VALUES (?, ?, ?)",
  getRootName: "SELECT name FROM rootuser WHERE id = ?",
  getUserInfo: "SELECT * FROM user WHERE id = ?",
  updateUserNickname: "UPDATE user SET nickName = ? WHERE id = ?",
  updateUserGender: "UPDATE user SET  gender = ? WHERE id = ?",
  updateUserAge: "UPDATE user SET  age = ? WHERE id = ?",
  changeAvater: "UPDATE user SET imgUrl = ? WHERE id = ?",
  changePhone: "UPDATE user SET phone = ? WHERE id = ?",
  getPwd: "SELECT password from user WHERE id = ?",
  changePwd: "UPDATE user SET password = ? WHERE id = ?",
  isStopUser: "UPDATE user SET flag = ? WHERE id = ?",
  changeUserStatus: "UPDATE user SET status = ? WHERE id = ?",
  totalUser:
    "SELECT *, nickName as name FROM user where nickName like ? AND flag like ? AND status like ? AND gender like ? AND phone like ? AND type like ? ORDER BY create_time DESC",
  todayAddUser: "SELECT * FROM user WHERE create_time >= ?",
  addTestUser:
    "INSERT INTO user (nickName, phone, password, imgUrl, age, gender, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
  resetActive: "UPDATE user SET active = 0 ",
  resetPwd: "UPDATE user SET password = ? WHERE phone = ?",
  changeActive: "UPDATE user SET active = active + ? WHERE id = ?",
  getActiveUser: "SELECT * FROM user ORDER BY active DESC LIMIT 10",
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
    ) b on a.click_date = b.datetime ORDER BY date`
};

const theme = {
  getAlltheme:
    "SELECT a.*, b.nickName, b.imgUrl FROM content_type a, user b WHERE a.uid = b.id AND a.status LIKE ? AND b.nickName LIKE ?",
  createtheme: "INSERT INTO content_type (name, status, flag, uid) VALUES (?, ?, ?, ?)",
  getthemeByUid:
    "SELECT a.*, b.nickName,b.imgUrl FROM content_type a, user b WHERE uid = ? AND a.uid = b.id AND a.status != 2  ORDER BY a.create_time DESC",
  getOpenTheme:
    "SELECT a.*,b.nickName, b.imgUrl FROM content_type a, user b WHERE a.status = 1 AND a.flag = 1 AND a.uid = b.id",
  getThemeById:
    "SELECT a.*, b.nickName,b.imgUrl FROM content_type a, user b WHERE a.id = ? AND a.uid = b.id AND a.status != 2",
  updatetheme: "UPDATE content_type SET name = ? WHERE id = ?",
  getThemeList:
    "SELECT a.id, a.name, a.status FROM content_type a, user b WHERE a.uid = ? AND a.uid = b.id AND a.status != 2 AND a.flag != 2",
  checktheme: "UPDATE content_type SET flag = ? , remark = ? WHERE id = ?",
  todayAddtheme: `SELECT  (SELECT count(*) FROM content_type WHERE create_time >= ? ) 
    AS count, (SELECT count(*) FROM content_type) AS allCount, (SELECT count(*) FROM content_type WHERE create_time >= ? )/(SELECT count(*) from 
    content_type) AS rate `
};

const content = {
  getOpencontentByTid: `
    SELECT 
    a.*, b.name, c.imgUrl, c.id as uid, c.nickName,(SELECT count(*) FROM comment d WHERE d.cid = a.id AND d.status = 1 ) as commentCount, (SELECT count(*) FROM  mark  WHERE mark.mark_id = a.id AND mark.status = 1) as markCount,
    (SELECT count(*) FROM save e WHERE e.cid = a.id AND e.status = 1) as saveCount
    from
    content a, content_type b, user c
    WHERE 
    a.tid = b.id AND b.uid = c.id AND a.flag !=2 AND a.flag !=0 AND a.status !=2   AND a.tid = ?
    `,
  getMycontentByTid:
   `  SELECT 
   a.*, b.name, c.imgUrl, c.id as uid, c.nickName, (SELECT count(*) FROM comment d WHERE d.cid = a.id AND d.status = 1 ) as commentCount, (SELECT count(*) FROM  mark  WHERE mark.mark_id = a.id AND mark.status = 1) as markCount,
  (SELECT count(*) FROM save e WHERE e.cid = a.id AND e.status = 1) as saveCount
 from
  content a, content_type b, user c
   WHERE a.tid = b.id AND b.uid = c.id AND a.flag !=2 AND a.flag !=0 AND a.status !=2 AND a.tid = ?`,
  createContent:
    "INSERT INTO content (context, img, video, audio, address,flag, status, is_comment, tid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  getAllContents: `
  SELECT 
    a.*, b.name, c.imgUrl, c.id as uid, c.nickName, (SELECT count(*) FROM comment d WHERE d.cid = a.id) as commentCount, (SELECT count(*) FROM  mark  WHERE mark.mark_id = a.id) as markCount,
    (SELECT count(*) FROM save e WHERE e.cid = a.id) as saveCount
    from
    content a, content_type b, user c
    WHERE 
    a.tid = b.id AND b.uid = c.id AND a.flag =1  AND a.status =1  LIMIT ?
  `,
  getAllContentsRoot: `SELECT a.*,b.name,c.nickName,c.imgUrl, c.id AS uid from content a, content_type b, user c WHERE a.tid = b.id AND b.uid = c.id AND a.flag LIKE ? AND a.status LIKE ? AND a.context LIKE ? AND c.nickName LIKE ? AND a.id LIKE ?`,
  getcontentByUid:
    "SELECT a.*, b.name, c.imgUrl, c.id as uid, c.nickName from content a, content_type b, user c WHERE a.tid = b.id AND b.uid = c.id AND a.status like ? AND a.flag like ? AND c.id = ?",
  getcontentCountByUid: 'SELECT a.id from content a, content_type b, user c WHERE a.tid = b.id AND b.uid = c.id  AND a.status !=2 AND c.id = ?',
  getcontentById: `
  SELECT 
    a.*, b.name, c.imgUrl, c.id as uid, c.nickName
    from
    content a, content_type b, user c 
    WHERE 
    a.tid = b.id AND b.uid = c.id AND a.flag !=2 AND a.status !=2 AND  a.id = ?
  `,
  getMyMarkContent: `
  SELECT 
   a.*, b.name, c.imgUrl, c.id as uid, c.nickName,(SELECT count(*) FROM comment d WHERE d.cid = a.id AND d.status = 1 ) as commentCount, (SELECT count(*) FROM  mark  WHERE mark.mark_id = a.id AND mark.status = 1) as markCount,
   (SELECT count(*) FROM save e WHERE e.cid = a.id AND e.status = 1) as saveCount
    from
    content a, content_type b, user c, mark 
    WHERE 
    a.tid = b.id AND b.uid = c.id AND a.status != 2 AND mark.mark_id = a.id AND mark.status = 1 AND mark.uid = ?
  `,
  getMySaveContent: `
  SELECT 
  a.*, b.name, c.imgUrl, c.id as uid, c.nickName,(SELECT count(*) FROM comment d WHERE d.cid = a.id AND d.status = 1 ) as commentCount, (SELECT count(*) FROM  mark  WHERE mark.mark_id = a.id AND mark.status = 1) as markCount,
  (SELECT count(*) FROM save e WHERE e.cid = a.id AND e.status = 1) as saveCount
    from
    content a, content_type b, user c, save 
    WHERE 
    a.tid = b.id AND b.uid = c.id AND a.status != 2 AND save.cid = a.id AND save.status = 1 AND save.uid = ?
  `,
  isDelContent: 'UPDATE content SET status = ? WHERE id = ?',
  isStopContent: "UPDATE content SET flag = ? , remark = ? WHERE id = ?",
  isStopContentByTid: "UPDATE content SET flag = ? WHERE tid = ? ",
  todayAddContent: "SELECT * from content WHERE create_time >= ?",
  todayAddContentRate: `SELECT  (SELECT count(*) FROM content WHERE create_time >= ?) AS count,
    (SELECT count(*) FROM content WHERE create_time >= ? )/(SELECT count(*) from content) AS rate `,
};

const comment = {
  getAllCommentsRoot: `SELECT a.*, b.context, c.nickName as comment_name, c.imgUrl as comment_imgUrl from 
    comment a, content b, user c WHERE  c.id = a.from_uid AND a.cid = b.id  AND a.content LIKE ? AND c.id LIKE ? 
    AND a.status like ? AND a.create_time >= ? AND a.create_time <= ?  `,
  addComment: `INSERT INTO comment(cid, from_uid, content) VALUES (?, ?, ?)`,  
  isStopComment: "UPDATE comment SET status = ? WHERE id = ?",
  getCommentByCid: `SELECT a.*,d.nickName,d.imgUrl FROM comment a, content b, content_type c, user d WHERE a.from_uid = d.id 
  AND b.tid = c.id AND a.cid = b.id  AND a.status = 1 AND a.cid = ? ORDER BY a.create_time DESC`
};

const save = {
  getAllSavesRoot: `SELECT a.*,b.context,c.nickName as saver_name,c.imgUrl from save a, content b, user c 
    WHERE a.cid = b.id AND a.uid = c.id AND b.context LIKE ? AND a.uid LIKE ? AND a.status LIKE ?`,
  getSaveByCid: `SELECT a.*,d.nickName,d.imgUrl FROM save a, content b, content_type c, user d WHERE a.uid = d.id AND b.tid = c.id AND a.cid = b.id  AND a.status = 1 AND a.cid = ?`,
  firstSaveContent: 'INSERT INTO save(uid, cid, status) VALUES (?, ?, ?)',
  isSaveContent: 'UPDATE save SET status = ? WHERE uid = ? AND cid = ?',
  isFirstSave: 'SELECT * FROM save WHERE uid = ? AND cid = ?',
  /** 我的收藏 */
  toSaveByUid: ` SELECT a.*,b.context,c.nickName as saver_name,c.imgUrl from save a, content b, user c 
    WHERE a.cid = b.id AND a.uid = c.id AND a.status = 1  AND a.uid = ?`,
  /** 获得的收藏 */
  getSaveByUid: `SELECT a.* FROM save a, content b, content_type c WHERE a.cid = b.id  AND 
  a.status = 1 AND b.tid = c.id AND c.uid = ?`
};

const mark = {
  getMarkByCid: `SELECT a.*,d.nickName,d.imgUrl FROM mark a, content b, content_type c, user d 
  WHERE a.uid = d.id AND b.tid = c.id AND a.mark_id = b.id  AND a.status = 1 AND a.mark_id = ?`,
  getAllMarksRoot: `SELECT a.*,b.context,c.nickName as marker_name,c.imgUrl from mark a, content b, user c 
    WHERE a.mark_id = b.id AND a.uid = c.id AND b.context LIKE ? AND a.uid LIKE ? AND a.status LIKE ?`,
  firstMarkContent: 'INSERT INTO mark(uid, mark_id, status) VALUES (?, ?, ?)',
  isMarkContent: 'UPDATE mark SET status = ? WHERE uid = ? AND mark_id = ?',
  isFirstMark: 'SELECT * FROM mark WHERE uid = ? AND mark_id = ?',
  /* 获取的点赞 */
  getMarkByUid: `SELECT a.* FROM mark a, content b, content_type c WHERE a.status = 1 AND a.mark_id = b.id AND b.tid = c.id AND c.uid = ?`,
  /** 我的点赞 */
  toMarkByUid: `SELECT a.*,b.context,c.nickName as saver_name,c.imgUrl from mark a, content b, user c 
    WHERE a.mark_id = b.id AND a.uid = c.id  AND a.status = 1 AND a.uid = ?`
};

module.exports = { user, theme, content, comment, save, mark };
