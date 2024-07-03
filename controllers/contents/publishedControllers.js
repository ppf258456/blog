const publishedService = require('../../service/content/publishedService');

const PublishedController = {
  getPublishedContent: async (req, res) => {
    try {
      const publishedContent = await publishedService.getPublishedContent();
      res.json(publishedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  unpublishContent: async (req, res) => {
    try {
      const { content_id } = req.params;
      const unpublishedContent = await publishedService.unpublishContent(content_id);
      res.json(unpublishedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = PublishedController;
