/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : xiaoxiao-app

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2019-10-15 18:20:16
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论 id',
  `cid` int(11) DEFAULT NULL COMMENT '内容 id',
  `from_uid` int(11) DEFAULT NULL COMMENT '评论人 id',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  `content` varchar(255) DEFAULT NULL COMMENT '评论内容',
  `status` int(11) DEFAULT '1' COMMENT '是否禁止 0 - 禁止， 1 - 不禁止',
  PRIMARY KEY (`id`),
  KEY `cid` (`cid`),
  KEY `from_uid` (`from_uid`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `content` (`id`),
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`from_uid`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES ('1', '1', '4', '2019-10-15 13:23:35', '这是一条评论', '1');
INSERT INTO `comment` VALUES ('2', '1', '7', '2019-10-15 15:46:06', '测试评论', '1');
INSERT INTO `comment` VALUES ('3', '1', '4', '2019-10-15 15:48:20', '我来评论啦！', '1');

-- ----------------------------
-- Table structure for content
-- ----------------------------
DROP TABLE IF EXISTS `content`;
CREATE TABLE `content` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '内容 id',
  `tid` int(11) DEFAULT NULL COMMENT '主题 id',
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `context` text COMMENT '内容',
  `mood` int(11) DEFAULT NULL COMMENT '心情 0 - 难过，1 - 一般，2 - 开心',
  `img` varchar(255) DEFAULT NULL COMMENT '图片',
  `video` varchar(255) DEFAULT NULL,
  `audio` varchar(255) DEFAULT NULL,
  `flag` int(11) DEFAULT '1' COMMENT '0 - 该内容主题删除  1 - 内容正常  2 - 内容违规被封禁',
  `status` int(11) DEFAULT '0' COMMENT '是否公开 0 - 不公开，1 - 公开',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `tid` (`tid`),
  CONSTRAINT `content_ibfk_1` FOREIGN KEY (`tid`) REFERENCES `content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of content
-- ----------------------------
INSERT INTO `content` VALUES ('1', '1', '测试文章标题', '我们城里九十平的房子，如果可以重新装修，我希望改造的有，可以说几乎全部。 从玄关开始，玄关那里，鞋柜不要到顶，柜子可以全屋定制，质量好点，选择原木色。和白色。混合。 鞋柜做半截。上面可以买挂钩，挂东西，比较实用。半截柜，还可以放小盆栽装点，也很美貌。 厨房，上面柜子除了包住油烟机和水表箱的，其他不做...', '1', 'http://pyku15h15.bkt.clouddn.com/1.jpg,http://pyku15h15.bkt.clouddn.com/0.jpg,http://pyku15h15.bkt.clouddn.com/1.jpg,http://pyku15h15.bkt.clouddn.com/0.jpg', 'http://pyku15h15.bkt.clouddn.com/movie.mp4', null, '1', '1', '2019-09-30 11:59:12', '2019-10-15 15:00:52');
INSERT INTO `content` VALUES ('2', '1', 'test文章标题', '我们城里九十平的房子，如果可以重新装修，我希望改造的有，可以说几乎全部。 从玄关开始，玄关那里，鞋柜不要到顶，柜子可以全屋定制，质量好点，选择原木色。和白色。混合。 鞋柜做半截。上面可以买挂钩，挂东西，比较实用。半截柜，还可以放小盆栽装点，也很美貌。 厨房，上面柜子除了包住油烟机和水表箱的，其他不做...', '2', 'http://pyku15h15.bkt.clouddn.com/0.jpg,http://pyku15h15.bkt.clouddn.com/1.jpg', null, null, '2', '1', '2019-09-30 12:29:27', '2019-10-15 15:04:13');
INSERT INTO `content` VALUES ('3', '2', 'test文章标题', '一个非英语专业的人的自述：用一年时间考上欧盟口译司 今天看到一篇文章，说是一个猛人用一年时间考上欧盟口译司，看完之后，只有一个感觉，就是意志力决定你的成功，就象我在昨天的文章中说到的，能有坚强意志力的人少之又少，但这个人绝对是其中之一。 我的网名叫做jacky，大学在青岛市念书，4年，中国海洋大学的计算...', '2', '', 'http://pyku15h15.bkt.clouddn.com/movie.mp4', null, '0', '1', '2019-10-08 14:07:53', '2019-10-15 15:04:50');
INSERT INTO `content` VALUES ('4', '2', 'test文章标题', '春天来了，我们要去郊外踏春，还要在餐桌上“咬春”。作为一个热爱生活的吃货，那就以春天之名来一道家常随意卷饼吧！ 春天终于来了！虽然冬天的寒意还没有完全褪去，但万物复苏，总是给人欣欣向荣的好心情呀！该上班的上班，该上学的上学，该做的工作还是要继续，该...', '2', '', null, 'http://pyku15h15.bkt.clouddn.com/%E5%AD%99%E8%89%BA%E7%90%AA%20-%20%E6%83%85%E7%81%AB.mp3', '0', '1', '2019-10-08 16:31:13', '2019-10-15 15:17:33');
INSERT INTO `content` VALUES ('5', '2', 'test文章标题', '这几天晚上趁baby睡觉了，我看了几集最新一季的《向往的生活》。片子里黄磊老师做了好几次葱油拌面，不同的嘉宾都非常喜欢，吃得心满意足。啧啧啧，这下子，葱油拌面的草算是在我心里牢牢种下了。这个葱油拌面，说实话在以前我是有点不屑一顾的。总觉得，葱油嘛，确..', '2', 'http://pyku15h15.bkt.clouddn.com/1.jpg', null, null, '0', '1', '2019-10-09 14:56:28', '2019-10-14 17:40:29');
INSERT INTO `content` VALUES ('6', '2', 'test文章标题', '希望你见到爸爸时第一句话是：爸爸我爱你，谢谢你！ 亲爱的花生： 当你能读懂妈妈写给你的这封信时我想也应该是可以带你去看爸爸的时候了，你现在肯定已经变成一个阳光帅气的少年了爸爸见到你一定会很开心很欣慰的，你应该不会在相信爸爸去忽忽星球这样的话了对吧，...', '2', 'http://pyku15h15.bkt.clouddn.com/1.jpg', null, null, '0', '0', '2019-10-12 10:54:03', '2019-10-14 17:40:31');
INSERT INTO `content` VALUES ('7', '10', 'test文章标题', '独自生活，家务变成了一件不可逃避的事。那么，把家务变得更具便利性，更有仪式感，使得它成为一种享受的愉悦方法，便成为我的心之所念。 天陡然冷了下来，是时候整理衣柜，把毛衣和地毯都拿出来，自己保暖的同时，也让家里换个样子。 独自生活，家务变成了一件不可...', '2', 'http://pyku15h15.bkt.clouddn.com/1.jpg', null, null, '1', '0', '2019-10-14 14:12:11', '2019-10-14 17:40:33');

-- ----------------------------
-- Table structure for content_type
-- ----------------------------
DROP TABLE IF EXISTS `content_type`;
CREATE TABLE `content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '内容类型 id',
  `uid` int(11) DEFAULT NULL COMMENT '用户 id',
  `name` varchar(20) DEFAULT NULL COMMENT '类型名称',
  `bgcolor` varchar(20) DEFAULT NULL COMMENT '背景颜色',
  `icon` varchar(20) DEFAULT NULL COMMENT '背景图标',
  `status` int(11) DEFAULT '1' COMMENT '是否显示 1 - 正常显示 0 - 被用户删除 2 - 被管理员封禁',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `contenttype_ibfk_1` (`uid`),
  CONSTRAINT `content_type_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of content_type
-- ----------------------------
INSERT INTO `content_type` VALUES ('1', '4', '测试name1', '#40a9ff', 'Icon-my', '1', '2019-09-30 11:12:05', '2019-10-14 14:04:14');
INSERT INTO `content_type` VALUES ('2', '4', '2018', '#40a9ff', 'Icon-my', '0', '2019-09-30 11:34:21', '2019-10-14 11:22:40');
INSERT INTO `content_type` VALUES ('3', '4', '666', '#40a9ff', 'Icon-my', '1', '2019-10-08 16:29:07', '2019-10-14 11:22:42');
INSERT INTO `content_type` VALUES ('4', '4', '777', '#40a9ff', 'Icon-my', '1', '2019-10-08 16:32:41', '2019-10-14 11:22:45');
INSERT INTO `content_type` VALUES ('5', '10', '大大', '#40a9ff', 'Icon-my', '1', '2019-10-09 10:01:45', '2019-10-14 11:22:50');
INSERT INTO `content_type` VALUES ('6', '12', '技术胖', '#40a9ff', 'Icon-my', '1', '2019-10-10 11:40:50', '2019-10-14 11:22:53');
INSERT INTO `content_type` VALUES ('7', '12', '技术胖123', '#40a9ff', 'Icon-my', '2', '2019-10-10 11:42:25', '2019-10-14 11:29:58');
INSERT INTO `content_type` VALUES ('8', '14', '小海豚01', '#40a9ff', 'Icon-my', '1', '2019-10-11 09:10:52', '2019-10-14 11:23:03');
INSERT INTO `content_type` VALUES ('9', '14', '袋鼠空间', '#40a9ff', 'Icon-my', '1', '2019-10-12 10:53:12', '2019-10-14 11:23:09');
INSERT INTO `content_type` VALUES ('10', '15', '老王的空间', '#40a9ff', 'Icon-my', '1', '2019-10-12 11:57:03', '2019-10-14 11:23:12');

-- ----------------------------
-- Table structure for mark
-- ----------------------------
DROP TABLE IF EXISTS `mark`;
CREATE TABLE `mark` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '点赞 id',
  `mark_id` int(11) DEFAULT NULL COMMENT '点赞内容 id',
  `uid` int(11) DEFAULT NULL COMMENT '点赞用户 id',
  `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `mark_count` int(11) DEFAULT NULL COMMENT '点赞数',
  PRIMARY KEY (`id`),
  KEY `mark_id` (`mark_id`),
  KEY `uid` (`uid`),
  CONSTRAINT `mark_ibfk_1` FOREIGN KEY (`mark_id`) REFERENCES `content` (`id`),
  CONSTRAINT `mark_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mark
-- ----------------------------

-- ----------------------------
-- Table structure for reply
-- ----------------------------
DROP TABLE IF EXISTS `reply`;
CREATE TABLE `reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '回复 id',
  `reply_id` int(11) DEFAULT NULL COMMENT '回复内容 id',
  `from_uid` int(11) DEFAULT NULL COMMENT '回复人 id',
  `to_uid` int(11) DEFAULT NULL COMMENT '评论人 id',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '回复时间',
  `content` varchar(255) DEFAULT NULL COMMENT '回复内容',
  `status` int(11) DEFAULT '1' COMMENT '是否禁止显示 0 - 禁止，1 - 不禁止',
  PRIMARY KEY (`id`),
  KEY `reply_id` (`reply_id`),
  CONSTRAINT `reply_ibfk_1` FOREIGN KEY (`reply_id`) REFERENCES `content` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of reply
-- ----------------------------

-- ----------------------------
-- Table structure for rootuser
-- ----------------------------
DROP TABLE IF EXISTS `rootuser`;
CREATE TABLE `rootuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of rootuser
-- ----------------------------
INSERT INTO `rootuser` VALUES ('3', '123456', '$2a$10$gcAjRWoHI/oQAsv6H7.P5O6Oautmk8yrRbYSoVdfNDLxuVQwTwz.e', '我是管理员');

-- ----------------------------
-- Table structure for save
-- ----------------------------
DROP TABLE IF EXISTS `save`;
CREATE TABLE `save` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '收藏 id',
  `cid` int(11) DEFAULT NULL COMMENT '内容 id',
  `uid` int(11) DEFAULT NULL COMMENT '用户 id',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  `status` int(11) DEFAULT '1' COMMENT '是否收藏 1 - 收藏，0 - 取消收藏',
  PRIMARY KEY (`id`),
  KEY `cid` (`cid`),
  KEY `uid` (`uid`),
  CONSTRAINT `save_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `content` (`id`),
  CONSTRAINT `save_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of save
-- ----------------------------
INSERT INTO `save` VALUES ('1', '1', '4', '2019-10-15 17:26:09', '1');
INSERT INTO `save` VALUES ('2', '1', '5', '2019-10-15 17:27:15', '1');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `nickName` varchar(20) DEFAULT NULL COMMENT '用户姓名(昵称)',
  `imgUrl` varchar(255) DEFAULT NULL COMMENT '用户(头像)',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `password` varchar(100) DEFAULT NULL COMMENT '登录密码',
  `age` int(11) DEFAULT NULL COMMENT '年龄',
  `gender` int(11) DEFAULT '1' COMMENT '性别 1 - 男， 2 - 女',
  `active` int(11) DEFAULT '0' COMMENT '活跃度 创建主题 +10 发表内容 +10 发表评论 +5 登录 +5 点赞 +7',
  `flag` int(11) DEFAULT '1' COMMENT '是否禁用 0 - 禁用，1 - 不禁用',
  `status` int(11) DEFAULT '0' COMMENT '是否在线 0 - 不在线，1 - 在线',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('4', '李怼怼', 'http://pyku15h15.bkt.clouddn.com/FndvW9ju6TO5RrTCe_ayXWNkuJWS ', '123456', '$2a$10$2OfGCZtjuvyGti7HIUroDOOzfnIdNGRuStqDRmlAkV11WyTXs0AEe', '32', '1', '0', '0', '0', '2019-09-30 10:23:57', '2019-10-14 10:29:14');
INSERT INTO `user` VALUES ('5', '张三丰', 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=320178652,790985626&fm=26&gp=0.jpg', '111', '$2a$10$w31xNFKYqjL53vpNwZEWr.8hP5UAIEd3JHynQoLzcPdVvQL4pnBcO', '32', '1', '0', '0', '0', '2019-09-30 15:09:50', '2019-10-14 10:25:25');
INSERT INTO `user` VALUES ('6', '赵小雷', 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1820523987,3798556096&fm=26&gp=0.jpg', '222', '$2a$10$K2wR4RBFUg7xOccEPSnnEe49I2/FrTUQmPd5praXIs.r1VFWoz6ja', '28', '1', '0', '1', '0', '2019-09-30 15:10:38', '2019-10-10 15:08:19');
INSERT INTO `user` VALUES ('7', '李梅', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1321463267,128419202&fm=26&gp=0.jpg', '333', '$2a$10$K2wR4RBFUg7xOccEPSnnEe49I2/FrTUQmPd5praXIs.r1VFWoz6ja', '26', '2', '0', '1', '0', '2019-09-30 15:11:55', '2019-10-10 15:08:53');
INSERT INTO `user` VALUES ('8', '韩一波', 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3276179142,1686381254&fm=26&gp=0.jpg', '555', '$2a$10$K2wR4RBFUg7xOccEPSnnEe49I2/FrTUQmPd5praXIs.r1VFWoz6ja', '37', '1', '0', '1', '0', '2019-09-30 15:12:58', '2019-10-12 11:58:57');
INSERT INTO `user` VALUES ('9', '王太利', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1897589137,2261370756&fm=26&gp=0.jpg', '666', '$2a$10$K2wR4RBFUg7xOccEPSnnEe49I2/FrTUQmPd5praXIs.r1VFWoz6ja', '42', '1', '0', '1', '0', '2019-09-30 15:13:54', '2019-10-10 15:10:36');
INSERT INTO `user` VALUES ('10', '王大大', 'http://img3.imgtn.bdimg.com/it/u=3864086826,2415830551&fm=26&gp=0.jpg', '777', '$2a$10$U5thkJvtKP8wA//yOcT/xuYoZKZLBfwbCmnf0MY37SPx1sMTpWPAm', '18', '1', '0', '1', '1', '2019-10-09 09:59:18', '2019-10-14 13:31:24');
INSERT INTO `user` VALUES ('11', '李国英', 'http://img5.imgtn.bdimg.com/it/u=2331676194,2426100219&fm=26&gp=0.jpg', '888', '$2a$10$ym85YlsibAT2WyvnyQAfc.13advTObqTnTX97vALD5OQyiYMmvmk6', '18', '2', '0', '0', '0', '2019-10-10 10:37:14', '2019-10-14 10:33:37');
INSERT INTO `user` VALUES ('12', '技术胖', 'http://blogimages.jspang.com/blogtouxiang1.jpg', '999', '$2a$10$ym85YlsibAT2WyvnyQAfc.13advTObqTnTX97vALD5OQyiYMmvmk6', '48', '1', '0', '1', '1', '2019-10-10 11:38:12', '2019-10-14 13:33:55');
INSERT INTO `user` VALUES ('13', '小海豚', 'http://blogimages.jspang.com/blogtouxiang1.jpg', '12345678', '$2a$10$KDwTEVRi11B1hC1FAbqSJuaXGmvs4dkAnIK9umB0v0DcYe.h/eaYm', '22', '1', '0', '0', '0', '2019-10-10 14:05:58', '2019-10-14 13:26:53');
INSERT INTO `user` VALUES ('14', '袋鼠空间', 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3399929080,474843673&fm=26&gp=0.jpg', '15188211507', '$2a$10$gcAjRWoHI/oQAsv6H7.P5O6Oautmk8yrRbYSoVdfNDLxuVQwTwz.e', '22', '1', '0', '1', '1', '2019-10-11 09:04:17', '2019-10-14 09:02:24');
INSERT INTO `user` VALUES ('15', '老王', 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2724886373,3500404552&fm=26&gp=0.jpg', '13986147522', '$2a$10$qQ2FU2QK7CISu26ue6R32.l2CQafroEKjRgkKa1lA.o6lamFM13DG', '46', '1', '0', '1', '1', '2019-10-12 11:55:44', '2019-10-15 08:36:08');
INSERT INTO `user` VALUES ('16', '老四', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1897589137,2261370756&fm=26&gp=0.jpg', '15927011382', '$2a$10$KsWoTqrWwd6lfNwAXrMGUOQBTAkeh3CNc1526S0xU38uIrC8PF8P2', '47', '1', '5', '0', '1', '2019-10-15 08:57:59', '2019-10-15 09:00:46');
