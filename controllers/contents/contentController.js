const contentService = require('../../service/content/contentService');
const { Op } = require('sequelize');
const { contents, content_categories, categories, User } = require('../../models');

// 辅助函数：验证状态码是否有效
const isValidStatus = (status) => {
  const validStatuses = [0, 1, 2, 3, 4, 5];
  return validStatuses.includes(status);
};

const contentController = {
  createContent: async (req, res) => {
    try {
      const { title, type, cover, content, tags,status  } = req.body;
      const { categoryIds } = req.body;
      const author_id = req.user.user_id;
      if (!isValidStatus(status)) {
        throw new Error('无效的状态码');
      }

      let  contentData = {
        title,
        type,
        cover,
        content,
        tags,
        status,
        author_id
      };

      if (status === 0 || status === 1) {
        const newContent = await contentService.createContent(contentData, categoryIds);
        let message = status === 0 ? "保存草稿" : "上传并提交审核";
        res.status(201).json({ content: newContent, message });
      } else {
        throw new Error('状态码不合法');
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

 // 获取草稿列表
 getDrafts: async (req, res) => {
  try {
    const author_id = req.user.user_id
    const drafts = await contentService.getDrafts(author_id);
    res.status(200).json(drafts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},
 // 获取草稿详情
 getDraftDetails: async (req, res) => {
  try {
    const content = await contentService.getContentById(req.params.content_id);

    // 检查是否是作者本人的草稿
    if (content.author_id !== req.user.user_id || content.status !== 0) {
      throw new Error('无权查看或内容不存在');
    }

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},
  // 更新草稿
  updateDraft: async (req, res) => {
    try {
      const { title, type, cover, content, tags, status } = req.body;
      const { categoryIds } = req.body;
      const author_id = req.user.user_id;

      if (!isValidStatus(status)) {
        throw new Error('无效的状态码');
      }

      let contentData = {
        title,
        type,
        cover,
        content,
        tags,
        status,
        author_id
      };

      // 根据状态码执行不同的逻辑
      if (status === 0) {
        // 状态码为0，保存草稿的逻辑
        const updatedContent = await contentService.updateContent(req.params.content_id, contentData, categoryIds);
        res.status(200).json(updatedContent, "保存草稿");
      } else if (status === 1) {
        // 状态码为1，上传并提交审核的逻辑
        contentData.status = 1; // 确保状态为提交审核
        const updatedContent = await contentService.updateAndSubmitForReview(req.params.content_id, contentData, categoryIds);
        res.status(200).json(updatedContent, "上传并提交审核");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 删除草稿（物理删除）
  deleteDraft: async (req, res) => {
    try {
      const result = await contentService.deleteContent(req.params.content_id);
      res.status(204).send(); // 成功删除返回 204 No Content
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getContentById: async (req, res) => {
    try {
      const { content_id } = req.params;
      const user = req.user;

      const content = await contentService.getContentById(content_id);

      if (!content) {
        return res.status(404).json({ message: '该内容不存在或已被删除' });
      }
      
      if (content.status === 4) {
        return res.status(200).json(content);
      }

    // 其他情况下，返回内容不存在或已被删除
    res.status(404).json({ message: '该内容不存在或已被删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

  updateContent: async (req, res) => {
    try {
      const { content_id } = req.params;
      const { title, type, cover, content, tags, status } = req.body;
      const { categoryIds } = req.body;
      const author_id = req.user.user_id; // 从JWT中获取作者ID

      const contentData = {
        title,
        type,
        cover,
        content,
        tags,
        status,
        author_id
      };
      const updatedContent = await contentService.updateContent(content_id, contentData, categoryIds);
      res.status(200).json(updatedContent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteContent: async (req, res) => {
    try {
      const user = req.user
      const result = await contentService.deleteContent(req.params.content_id, user);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSoftDeletedContents: async (req, res) => {
    try {
      const user = req.user
      const softDeletedContents = await contentService.getSoftDeletedContents(user);
      res.status(200).json(softDeletedContents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  restoreSoftDeletedContent: async (req, res) => {
    try {
      const user = req.user
      const result = await contentService.restoreSoftDeletedContent(req.params.content_id,user);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllContents: async (req, res) => {
    try {
      const allContents = await contentService.getAllContents();
      res.status(200).json(allContents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAuthorContents: async (req, res) => {
    try {
      const authorContents = await contentService.getAuthorContents(req.user.user_id);
      res.status(200).json(authorContents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = contentController;
