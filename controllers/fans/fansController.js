const fanService = require('../../service/fans/fansService');
const classService = require('../../service/class_/classService')
const fanController = {
  // 获取用户的粉丝列表
  getFans: async (req, res, next) => {
    const user_id = req.params.user_id;
    const class_id = req.query.class_id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    try {
      const followers = await fanService.getFollowers(user_id,class_id, page, limit);
      res.status(200).json(followers);
    } catch (err) {
      console.error('获取粉丝列表出错:', err);
      next(err);
    }
  },
   // 更改粉丝分组
   updateFanClassify: async (req, res, next) => {
    const { fan_id, followed_id, new_classify_id } = req.body;
    try {
      const classType = await classService.getClassType(new_classify_id);
      if (classType !== 'fans') {
        return res.status(400).json({ message: '无效的分组类型' });
      }
      const result = await fanService.updateFanClassify(fan_id, followed_id, new_classify_id);
      res.status(200).json({ message: '粉丝分组更新成功', result });
    } catch (err) {
      res.status(500).json({ message: '服务器错误', error: err.message });
    
    }
  },
};

module.exports = fanController;
