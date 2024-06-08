
const loginService = require('../service/login/loginService');

async function login(req, res) {
  const { member_number, password } = req.body;

  try {
    const token = await loginService.loginUser(member_number, password);
    console.log(token);
    // localStorage=token
    
    res.status(200).json({message:"login successful", token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ error: error.message });
  }
}




module.exports = {
  login
 
};
