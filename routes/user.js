let express = require('express');
let router = express.Router();
let userData = require('../services/user');


router.post('/login',async (req, res) => {
   await userData.login(req, res);
})
router.post('/register',async (req, res) => {
   await userData.register(req, res);
})
router.put('/updateNickname',async (req, res) => {
   await userData.updateNickname(req, res);
})
router.put('/updateGender',async (req, res) => {
   await userData.updateGender(req, res);
})
router.put('/updateAge',async (req, res) => {
   await userData.updateAge(req, res);
})
router.put('/updateAvater', async (req, res) => {
   await userData.updateAvater(req, res);
})
router.put('/updatePwd', async (req, res) => {
   await userData.updateUserPwd(req, res)
})
router.get('/getInfo',async (req, res)=> {
   await userData.getInfo(req,res);
})
router.get('/totalUser', async (req, res) => {
   await userData.totalUser(req, res);
});
router.get('/todayAddUser',async (req, res) => {
   await userData.todayAddUser(req, res);
});
router.put('/updateUserAvter',async (req, res) => {
   await userData.updateUserAvter(req, res);
})
router.put('/updateUserPhone',async (req, res) => {
   await userData.updateUser(req, res);
})
router.post('/logout',async (req, res) => {
   await userData.logout(req, res);
})
router.get('/addTestUser',async (req, res) => {
   await userData.addTestUser(req, res);
})
router.get('/rootRegister',async (req, res) => {
   await userData.rootRegister(req, res);
})
router.get('/rootLogin',async (req, res) => {
   await userData.rootLogin(req, res);
})
router.get('/resetActive',async (req, res) => {
   await userData.resetActive(req, res);
})
router.get('/activeUsers',async (req, res) => {
   await userData.getActiveUsers(req, res);
})
router.get('/genderRate',async (req, res) => {
   await userData.getGenderRate(req, res);
})
router.get('/sevenDaysAddUser',async (req, res) => {
   await userData.getSevenDaysRegisterUser(req, res);
})
router.put('/updateUserPwd',async (req, res) => {
   await userData.resetPwd(req, res);
})
router.get('/testSearch',async (req, res) => {
   await userData.testSearch(req, res);
})
router.get('/liveRate',async (req, res) => {
   await userData.getLiveRate(req, res);
})
router.get('/isStopUser',async (req, res) => {
   await userData.isStopUser(req, res);
})
router.get('/userExcel',async (req, res) => {
   await userData.userExcel(req, res);
})
router.put('/resetPwd', async (req, res) => {
   await userData.resetPwd(req, res);
})

module.exports = router;