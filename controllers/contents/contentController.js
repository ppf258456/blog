const contentService = require('../../service/content/contentService');

const contentController = {
  createContent: async (req, res) => {
    try {
      
      const { title, type, cover, content, tags,status  } = req.body;
      const { categoryIds } = req.body;
      const author_id = req.user.user_id;
      const contentData = {
        title,
        type,
        cover,
        content,
        tags,
        status,
        author_id
      };
      const newContent = await contentService.createContent(contentData,categoryIds);
      res.status(201).json(newContent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getContentById: async (req, res) => {
    try {
      const content = await contentService.getContentById(req.params.content_id);
      res.status(200).json(content);
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
