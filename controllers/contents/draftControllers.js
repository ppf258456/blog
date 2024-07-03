// draftController.js
const draftService = require('../../service/content/draftService');

const draftController = {
  /**
   * 创建草稿
   * @route POST /drafts
   * @body {object} req.body - 草稿数据
   * @property {string} title - 草稿标题
   * @property {string} type - 内容类型
   * @property {string} cover - 封面图 URL（可选）
   * @property {string} content - 草稿内容
   * @property {string} tags - 标签（可选）
   * @property {array} categoryIds - 分类ID数组
   */
  createDraft: async (req, res, next) => {
    try {
      const { title, type, cover, content, tags, categoryIds } = req.body;
      const draftData = { title, type, cover, content, tags, status: 0 }; // 草稿状态码为0
      const draft = await draftService.createDraft(req.user.user_id, draftData, categoryIds);
      res.status(201).json(draft);
    } catch (error) {
      next(error);
    }
  },

  /**
   * 获取草稿列表
   * @route GET /drafts
   */
  getDrafts: async (req, res, next) => {
    try {
      const drafts = await draftService.getDrafts(req.user.user_id);
      res.json(drafts);
    } catch (error) {
      next(error);
    }
  },

  /**
   * 获取草稿详情
   * @route GET /drafts/:content_id
   * @param {string} req.params.content_id - 草稿ID
   */
  getDraftById: async (req, res, next) => {
    try {
      const draft = await draftService.getDraftById(req.params.content_id, req.user.user_id);
      res.json(draft);
    } catch (error) {
      next(error);
    }
  },

  /**
   * 更新草稿
   * @route PUT /drafts/:content_id
   * @param {string} req.params.content_id - 草稿ID
   * @body {object} req.body - 草稿数据
   * @property {string} title - 草稿标题
   * @property {string} type - 内容类型
   * @property {string} cover - 封面图 URL（可选）
   * @property {string} content - 草稿内容
   * @property {string} tags - 标签（可选）
   * @property {array} categoryIds - 分类ID数组
   */
  updateDraft: async (req, res, next) => {
    try {
      const { title, type, cover, content, tags, categoryIds } = req.body;
      const draftData = { title, type, cover, content, tags, status: 0 }; // 草稿状态码为0
      const updatedDraft = await draftService.updateDraft(req.params.content_id, req.user.user_id, draftData, categoryIds);
      res.json(updatedDraft);
    } catch (error) {
      next(error);
    }
  },

  /**
   * 删除草稿
   * @route DELETE /drafts/:content_id
   * @param {string} req.params.content_id - 草稿ID
   */
  deleteDraft: async (req, res, next) => {
    try {
      const deletedCount = await draftService.deleteDraft(req.params.content_id, req.user.user_id);
      res.json({ deletedCount });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = draftController;