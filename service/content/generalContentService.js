const { contents, content_categories, categories } = require('../../models');
const { Op } = require('sequelize');

const GeneralContentService = {
  // 获取所有内容列表
  getAllContents: async () => {
    try {
      const allContents = await contents.findAll({
        include: [
          {
            model: categories,
            as: 'category_id_categories',
            through: { attributes: [] }
          }
        ],
        where: {
          [Op.or]: [
            { status: 4 }, // 发布状态
            { status: 1 }, // 审核状态
            { status: { [Op.in]: [2, 3] } }, // 审核通过和驳回状态
            { status: { [Op.is]: 0 } } // 草稿状态
          ]
        }
      });

      return allContents;
    } catch (error) {
      throw new Error(`获取所有内容列表时出错: ${error.message}`);
    }
  },

  // 获取某作者的所有作品
  getContentsByAuthor: async (author_id) => {
    try {
      const authorContents = await contents.findAll({
        where: { author_id },
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
      throw new Error(`获取作者作品列表时出错: ${error.message}`);
    }
  }
};

module.exports = GeneralContentService;
