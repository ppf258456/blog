const reviewService = require('../../service/content/reviewService');

const ReviewController = {
  /**
   * 提交内容进行审核
   * @route POST /review/submit/:content_id
   * @param {object} req - 请求对象
   * @param {object} res - 响应对象
   */
  submitForReview: async (req, res) => {
    try {
      const { content_id } = req.params;
      const { title, type, cover, content, tags, categoryIds } = req.body;
      const contentData = { title, type, cover, content, tags };

      const submittedContent = await reviewService.submitForReview(content_id, contentData, categoryIds);
      res.json(submittedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * 审核通过内容
   * @route POST /review/approve/:content_id
   * @param {object} req - 请求对象
   * @param {object} res - 响应对象
   */
  approveContent: async (req, res) => {
    try {
      const { content_id } = req.params;
      const approvedContent = await reviewService.approveContent(content_id);
      res.json(approvedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * 审核驳回内容
   * @route POST /review/reject/:content_id
   * @param {object} req - 请求对象
   * @param {object} res - 响应对象
   */
  rejectContent: async (req, res) => {
    try {
      const { content_id } = req.params;
      const rejectedContent = await reviewService.rejectContent(content_id);
      res.json(rejectedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ReviewController;
