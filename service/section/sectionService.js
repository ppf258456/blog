// sectionService.js

const { sections } = require('../../models');
const { Op } = require('sequelize');

const sectionService = {
  // 创建新的分区
  createSection: async (sectionData) => {
    try {
      const { section_name, section_description } = sectionData;
console.log(section_name.length);
     // 输入验证
    if (!section_name || typeof section_name !== 'string' || section_name.length > 50) {
      throw new Error('Invalid section name');
     }
    if (section_description && typeof section_description !== 'string') {
      throw new Error('Invalid section description');
      }
      // 检查是否已经存在相同的 section_name 或 section_description
      const existingSection = await sections.findOne({
        where: {
          [Op.or]: [
            { section_name },
            { section_description }
          ]
        }
      });

      if (existingSection) {
        throw new Error('Section name or description already exists');
      }
      const newSection = await sections.create(sectionData);
      return newSection;
    } catch (error) {
      throw new Error(`创建分区时出错: ${error.message}`);
    }
  },

  // 获取所有分区
  getAllSections: async () => {
    try {
      const allSections = await sections.findAll();
      return allSections;
    } catch (error) {
      throw new Error(`获取所有分区时出错: ${error.message}`);
    }
  },

  // 获取单个分区信息
  getSectionById: async (section_id) => {
    try {
      const section = await sections.findByPk(section_id);
      if (!section) {
        throw new Error(`找不到ID为 ${section_id} 的分区`);
      }
      return section;
    } catch (error) {
      throw new Error(`获取分区信息时出错: ${error.message}`);
    }
  },

  // 更新分区信息
  updateSection: async (section_id, sectionData) => {
    try {
      const { section_name, section_description } = sectionData;
        // 输入验证
        if (!section_name || typeof section_name !== 'string' || section_name.length > 50) {
          throw new Error('Invalid section name. It must be a string with a maximum length of 50 characters.');
        }
        if (section_description && typeof section_description !== 'string') {
          throw new Error('Invalid section description');
        }
  
        // 检查是否已经存在相同的 section_name 或 section_description
        const existingSection = await sections.findOne({
          where: {
            [Op.or]: [
              { section_name },
              { section_description }
            ],
            [Op.not]: [
              { section_id } // 排除当前正在更新的分区
            ]
          }
        });
  
        if (existingSection) {
          throw new Error('Section name or description already exists');
        }
      const updatedSection = await sections.update(sectionData, {
        where: { section_id: section_id },
        returning: true,
      });
      if (!updatedSection[0]) {
        throw new Error(`找不到ID为 ${section_id} 的分区，更新失败`);
      }
      return updatedSection[1][0];
    } catch (error) {
      throw new Error(`更新分区信息时出错: ${error.message}`);
    }
  },

  // 删除分区
  deleteSection: async (section_id) => {
    try {
      const deletedSection = await sections.destroy({
        where: { section_id: section_id },
      });
      if (!deletedSection) {
        throw new Error(`找不到ID为 ${section_id} 的分区，无法删除`);
      }
      return { success: true };
    } catch (error) {
      throw new Error(`删除分区时出错: ${error.message}`);
    }
  },
};

module.exports = sectionService;
