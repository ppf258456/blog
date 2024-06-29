// sectionsController.js

const sectionService = require('../../service/section/sectionService');
const { body, validationResult } = require('express-validator');

const sectionsController = {
  createSection: async (req, res, next) => {
    try {
      await body('section_name').notEmpty().withMessage('Section name is required').run(req);
      await body('section_description').optional().run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
          }

      const { section_name, section_description } = req.body;
      const newSection = await sectionService.createSection({ section_name, section_description });
      res.status(201).json({ success: true, data: newSection });
    } catch (error) {
      console.error('创建分区时出错:', error);
       // 错误响应
      res.status(500).json({ success: false, message: 'An error occurred while creating the section', error: error.message });
      
    }
  },

  getAllSections: async (req, res, next) => {
    try {
      const allSections = await sectionService.getAllSections();
      res.status(200).json({ success: true, data: allSections });
    } catch (error) {
      console.error('获取所有分区时出错:', error);
      next(error);
    }
  },

  getSectionById: async (req, res, next) => {
    try {
      const { section_id } = req.params;
      console.log(req.params);
      const section = await sectionService.getSectionById(section_id);
      res.status(200).json({ success: true, data: section });
    } catch (error) {
      console.error('获取分区信息时出错:', error);
      next(error);
    }
  },

  updateSection: async (req, res, next) => {
    try {
      const { section_id } = req.params;
      await body('section_name').notEmpty().withMessage('Section name is required').run(req);
      await body('section_description').optional().run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
          }
      const { section_name, section_description } = req.body;
      const updatedSection = await sectionService.updateSection(section_id, { section_name, section_description });
      res.status(200).json({ success: true, data: updatedSection });
    } catch (error) {
      console.error('更新分区信息时出错:', error);
      if (error.message.includes('Invalid section name') || error.message.includes('Invalid section description')) {
        return res.status(400).json({ success: false, message: error.message });
      } else if (error.message.includes('Section name or description already exists')) {
        return res.status(409).json({ success: false, message: error.message });
      } else if (error.message.includes('找不到ID为')) {
        return res.status(404).json({ success: false, message: error.message });
      } else {
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'An error occurred while updating the section', error: error.message });
        }
       
      }
    }
  },

  deleteSection: async (req, res, next) => {
    try {
      const { section_id } = req.params;
   
      const result = await sectionService.deleteSection(section_id);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('删除分区时出错:', error);
      next(error);
    }
  },
};

module.exports = sectionsController;
