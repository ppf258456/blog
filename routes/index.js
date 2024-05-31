var express = require('express');
var router = express.Router();
const User = require('../models/user');
/* GET home page. */
router.get('/', async (req, res,next) => {
  try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
    });
      // console.log(123);
      res.json(users);// 返回json数据
  } catch (err) {
     next(err)
  }
});

module.exports = router;
