const checkOnlineService = require('../service/checkOnlineService');

exports.checkOnline = async (req, res) => {
  try {
    const userId = req.user.user_id; // 从中间件中获取已验证的用户 ID
    // console.log(userId);
    const isOnline = await checkOnlineService.isUserOnline(userId);

    if (isOnline) {
      res.status(200).json({ message: 'User is online' });
    } else {
      res.status(200).json({ message: 'User is not online' });
    }
  } catch (error) {
    console.error('Error checking online status:', error);
    res.status(500).json({ error: error.message });
  }
};
