// classService.js
const { Class_ } = require('../../models');

  // 检查分组是否已存在
  async function isClassExists  (class_name, class_type, user_id)  {
    const existingClass = await Class_.findOne({
      where: {
        class_name,
        class_type,
        user_id
      }
    });
    return existingClass !== null;
  }


const classService = {
  // 创建分组
  createClass: async (class_name, class_type, user_id) => {
     // 使用抽离的验证方法
     if (await isClassExists(class_name, class_type, user_id)) {
        throw new Error(`A class with name "${class_name}" and type "${class_type}" already exists for this user.`);
      }
  
      return Class_.create({
        class_name,
        class_type,
        user_id,
        is_default: false // 根据需要设置默认分组逻辑
      });
    },
  // 读取所有分组
  getClasses: async (user_id,class_type) => {
    return Class_.findAll({
      where: { user_id,class_type },
      order: [['class_name', 'ASC']] // 假设我们按名称排序
    });
  },
  // 读取单个分组
  getClassById: async (class_id, user_id) => {
    return Class_.findOne({
      where: { class_id, user_id }
    });
  },
  // 更新分组信息
  updateClass: async (class_id, user_id, updates) => {
     // 检查更新后的分组名称和类型是否与现有其他分组重复
     const { class_name, class_type } = updates;
     if (await isClassExists(class_name, class_type, user_id)) {
       throw new Error(`A class with name "${class_name}" and type "${class_type}" already exists for this user.`);
     }
        // 执行更新操作
        const updatedRows = await Class_.update(updates, {
            where: { class_id, user_id },
            individualHooks:true,
          });
          // 检查是否实际更新了行
    if (updatedRows === 0) {
        throw new Error('No class found with the given ID or user ID.');
      }
  
      return true; // 返回更新成功
   
  },
  // 软删除分组
  deleteClassSoft: async (class_id, user_id) => {
    const deletedRows = await Class_.update(
      { deletedAt: new Date() }, // 使用 deletedAt 进行软删除
      {
        where: { class_id, user_id }
      }
    );
    return deletedRows > 0; // 返回是否删除成功
  },
  // 硬删除分组
  deleteClassHard: async (class_id) => {
    const deletedRows = await Class_.destroy({
      where: { class_id }
    });
    return deletedRows > 0; // 返回是否删除成功
  },
};

module.exports = classService;