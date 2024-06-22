
const classService = require('../../service/class_/classService');

const classController = {
  // 创建分组
  createClass: async (req, res) => {
    try {
      const { class_name, class_type, user_id } = req.body;
      const newClass = await classService.createClass(class_name, class_type, user_id);
      res.status(201).json(newClass);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // 获取所有分组
  getClasses: async (req, res) => {
    try {
      const { user_id } = req.params;
      const class_type = req.query.class_type; // 从查询参数中获取 class_type
      const classes = await classService.getClasses(user_id,class_type);
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 更新分组信息
  updateClass: async (req, res) => {
    try {
      const { class_id } = req.params;
      const { class_name, class_type } = req.body;
      const updates = { class_name, class_type };
      const user_id = req.user.dataValues.user_id
      const success = await classService.updateClass(class_id, user_id,updates);
      if (success) {
        res.json({ message: 'Class updated successfully.' });
      } else {
        res.status(404).json({ message: 'Class not found.' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // 删除分组
  deleteClass: async (req, res) => {
    try {
      const { class_id } = req.params;
      const success = await classService.deleteClassHard(class_id);
      if (success) {
        res.json({ message: 'Class deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Class not found.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = classController;