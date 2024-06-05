
const registerService = require('../service/register/registerService');

async function register(req, res) {
  const { username, email, password, member_number, avatar, introduction, user_role, account_status } = req.body;

  try {
    const newUser = await registerService.registerUser(username, email, password, member_number, avatar, introduction, user_role, account_status);
    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  register
};
