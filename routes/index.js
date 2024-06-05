var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res,next) => {
res.json({message:"启动成功"})
});

module.exports = router;
