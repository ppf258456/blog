const { contents, content_categories, categories,  } = require('../../models');
const { Op } = require('sequelize');

const contentService = {
  // 创建内容并关联分类
  createContent: async (contentData, categoryIds) => {
   
    const transaction = await contents.sequelize.transaction();
    try {
      const newContent = await contents.create(contentData,{ transaction });

      // 创建内容与分类的关联
      const categoryAssociations = categoryIds.map(category_id => ({
        content_id: newContent.content_id,
        category_id
      }));

      await content_categories.bulkCreate(categoryAssociations, { transaction });

      await transaction.commit();
      return newContent;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`创建内容时出错: ${error.message}`);
    }
  },

  // 根据ID获取内容
  getContentById: async (content_id) => {
    try {
      const content = await contents.findOne({
        where: { content_id },
        include: [
          {
            model: categories,
            as: 'category_id_categories',
            through: { attributes: [] }
          }
        ]
      });

      if (!content) {
        throw new Error(`找不到ID为 ${content_id} 的内容`);
      }

      return content;
    } catch (error) {
      throw new Error(`获取内容时出错: ${error.message}`);
    }
  },

  // 更新内容并更新分类关联
  updateContent: async (content_id, contentData, categoryIds) => {
    const transaction = await contents.sequelize.transaction();
    try {
      const updatedRowCount = await contents.update(contentData, {
        where: { content_id, author_id: contentData.author_id },
        transaction
      });
  
      if (updatedRowCount[0] === 0) {
        throw new Error(`找不到ID为 ${content_id} 或作者ID不匹配的内容，更新失败`);
      }
  
      // 删除旧的关联
      await content_categories.destroy({
        where: { content_id },
        transaction
      });
  
      // 创建新的关联
      const categoryAssociations = categoryIds.map(category_id => ({
        content_id,
        category_id
      }));
  
      await content_categories.bulkCreate(categoryAssociations, { transaction });
  
      await transaction.commit();
      return await contents.findByPk(content_id);
    } catch (error) {
      await transaction.rollback();
      throw new Error(`更新内容时出错: ${error.message}`);
    }
  },

  // 删除内容
  deleteContent: async (content_id, user) => {
    try {

      const content = await contents.findOne({ where: { content_id } });
    
      if (!content) {
        throw new Error(`找不到ID为 ${content_id} 的内容，删除失败`);
      }
  
      if (user.user_role !== 'admin' && user.user_role !== 'audit' && user.user_id !== content.author_id) {
        throw new Error('您没有权限删除此内容');
      }
      const deletedContent = await contents.destroy({
        where:{content_id}
      });
      return { success: true };
    } catch (error) {
      throw new Error(`删除内容时出错: ${error.message}`);
    }
  },

  // 查询软删除的内容
  getSoftDeletedContents: async (user) => {

    try {

      let whereClause = { deletedAt: { [Op.not]: null } }; // 查询已软删除的记录
      
      if (user.user_role !== 'admin' && user.user_role !== 'audit' ) {
        whereClause.author_id = user.user_id; // 普通用户只能查看自己软删除的内容
      }
  
      const deletedContents = await contents.findAll({
        where: whereClause,
        paranoid: false, // 需要查询软删除的记录需要设置 paranoid: false
        include: [
          {
            model: categories,
            as: 'category_id_categories',
            through: { attributes: [] }
          }
        ]
      });
  
      return deletedContents;
    } catch (error) {
      throw new Error(`查询软删除内容时出错: ${error.message}`);
    }
  },

  // 恢复软删除的内容
  restoreSoftDeletedContent: async (content_id,user) => {
    try {
      const content = await contents.findOne({ where: { content_id }, paranoid: false });

      if (!content) {
        throw new Error(`找不到ID为 ${content_id} 的已软删除内容，恢复失败`);
      }
      if (user.user_role !== 'admin' && user.user_role !== 'audit' && user.user_id !== content.author_id) {
        throw new Error('您没有权限恢复软删除的内容');
      }
      await contents.restore({
        where: { content_id }
      });
  
      return { success: true };
    } catch (error) {
      throw new Error(`恢复软删除内容时出错: ${error.message}`);
    }
  },
 // 获取所有内容列表（审核用）
 getAllContents: async () => {
  try {
    const allContents = await contents.findAll({
      include: [
        {
          model: categories,
          as: 'category_id_categories',
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'author'
        }
      ]
    });

    return allContents;
  } catch (error) {
    throw new Error(`获取内容列表时出错: ${error.message}`);
  }
},

// 获取某作者的所有作品
getContentsByAuthor: async (userId) => {
  try {
    const authorContents = await contents.findAll({
      where: { author_id: userId },
      include: [
        {
          model: categories,
          as: 'category_id_categories',
          through: { attributes: [] }
        }
      ]
    });

    return authorContents;
  } catch (error) {
    throw new Error(`获取作者内容时出错: ${error.message}`);
  }
},
};

module.exports = contentService;
