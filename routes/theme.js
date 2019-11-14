let express = require('express');
let router = express.Router();
let ThemeData = require('../services/theme');


router.post('/createTheme',async (req, res) => {
    await ThemeData.createTheme(req, res);
});
router.get('/getThemeByUid', async (req, res) => {
    await ThemeData.getThemeByUid(req, res);
})
router.get('/getOpenTheme', async (req, res) => {
    await ThemeData.getOpenTheme(req, res)
})
router.post('/updateTheme', async (req, res) => {
    await ThemeData.updateTheme(req, res);
})
router.get('/isdeleteTheme', async (req, res) => {
    await ThemeData.isdeleteTheme(req, res);
})
router.get('/allTheme', async (req, res) => {
    await ThemeData.allTheme(req, res);
})
router.get('/todayTheme', async (req, res) => {
    await ThemeData.todayTheme(req, res);
})

module.exports = router;