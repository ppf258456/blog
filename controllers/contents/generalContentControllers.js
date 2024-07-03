const generalContentService = require('../../service/content/generalContentService');

const GeneralContentController = {
  getAllContents: async (req, res) => {
    try {
      const allContents = await generalContentService.getAllContents();
      res.json(allContents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getContentById: async (req, res) => {
    try {
      const { content_id } = req.params;
      const content = await generalContentService.getContentById(content_id);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getContentsByAuthor: async (req, res) => {
    try {
      const { user_id } = req.params;
      const authorContents = await generalContentService.getContentsByAuthor(user_id);
      res.json(authorContents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = GeneralContentController;
