const { categories } = require('../../models');
const { Op } = require('sequelize');

const categoryService = {
  // 创建新的分类
  createCategory: async (categoryData) => {
    try {
      const { category_name, section_id } = categoryData;

      // 输入验证
      if (!category_name || typeof category_name !== 'string' || category_name.length > 50) {
        throw new Error('Invalid category name');
      }
      if (!section_id || typeof section_id !== 'number') {
        throw new Error('Invalid section ID');
      }

      // 检查是否已经存在相同的 category_name，包括软删除的记录
      const existingCategory = await categories.findOne({
        where: {
          category_name,
          section_id,
          deletedAt: { [Op.not]: null }
        },
        paranoid: false
      });

      if (existingCategory) {
        throw new Error('Category name already exists in this section');
      }

      const newCategory = await categories.create(categoryData);
      return newCategory;
    } catch (error) {
      throw new Error(`创建分类时出错: ${error.message}`);
    }
  },

  // 获取所有分类
  getAllCategories: async () => {
    try {
      const allCategories = await categories.findAll();
      return allCategories;
    } catch (error) {
      throw new Error(`获取所有分类时出错: ${error.message}`);
    }
  },

  // 获取单个分类信息
  getCategoryById: async (category_id) => {
    try {
      const category = await categories.findByPk(category_id);
      if (!category) {
        throw new Error(`找不到ID为 ${category_id} 的分类`);
      }
      return category;
    } catch (error) {
      throw new Error(`获取分类信息时出错: ${error.message}`);
    }
  },

  // 更新分类信息
  updateCategory: async (category_id, categoryData) => {
    const transaction = await categories.sequelize.transaction();
    try {
      const { category_name, section_id } = categoryData;
  
      // 输入验证
      if (!category_name || typeof category_name !== 'string' || category_name.length > 50) {
        throw new Error('Invalid category name. It must be a string with a maximum length of 50 characters.');
      }
      if (!section_id || typeof section_id !== 'number') {
        throw new Error('Invalid section ID');
      }
  
      // 获取原始分类信息
      const originalCategory = await categories.findOne({
        where: { category_id },
        transaction
      });
  
      if (!originalCategory) {
        throw new Error(`找不到ID为 ${category_id} 的分类`);
      }
  
      // 检查是否已经存在相同的 category_name 和 section_id，包括软删除的记录
      const existingCategory = await categories.findOne({
        where: {
          category_name,
          section_id,
          category_id: { [Op.ne]: category_id },
          deletedAt: { [Op.not]: null }
        },
        paranoid: false,
        transaction
      });
  
      if (existingCategory) {
        throw new Error('Category name already exists in this section');
      }
  
      // 检查新值是否与原始值相同
      if (category_name === originalCategory.category_name && section_id === originalCategory.section_id) {
        await transaction.commit();
        return { message: 'The new values are the same as the current values. No update was made.' };
      }
  
      // 执行更新操作
      const [updatedRowCount] = await categories.update(categoryData, {
        where: { category_id },
        transaction
      });
  
      if (updatedRowCount === 0) {
        throw new Error(`找不到ID为 ${category_id} 的分类，更新失败`);
      }
  
      // 再次查询更新后的分类信息
      const updatedCategory = await categories.findOne({ where: { category_id }, transaction });
  
      await transaction.commit();
      return updatedCategory;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`更新分类信息时出错: ${error.message}`);
    }
  },

  // 删除分类信息（软删除）
  deleteCategory: async (category_id) => {
    try {
      const deletedCategory = await categories.destroy({
        where: { category_id }
      });

      if (!deletedCategory) {
        throw new Error(`找不到ID为 ${category_id} 的分类，删除失败`);
      }

      return { success: true };
    } catch (error) {
      throw new Error(`删除分类时出错: ${error.message}`);
    }
  },

  // 恢复被软删除的分类
  restoreCategory: async (category_id) => {
    try {
      const restoredCategory = await categories.restore({
        where: { category_id }
      });

      if (!restoredCategory) {
        throw new Error(`找不到ID为 ${category_id} 的分类，恢复失败`);
      }

      return { success: true };
    } catch (error) {
      throw new Error(`恢复分类时出错: ${error.message}`);
    }
  },

  // 获取被软删除的分类
  getDeletedCategories: async () => {
    try {
      const deletedCategories = await categories.findAll({
        where: { deletedAt: { [Op.not]: null } },
        paranoid: false
      });
      return deletedCategories;
    } catch (error) {
      throw new Error(`获取被软删除的分类时出错: ${error.message}`);
    }
  },
  
  //获取分区下的分类
 getCategoriesBySection : async (section_id) => {
    try {
      const categoriesList = await categories.findAll({
        where: { section_id }
      });
      return categoriesList;
    } catch (error) {
      throw new Error(`获取分区下的分类时出错: ${error.message}`);
    }
  },
  
  
};

module.exports = categoryService;
