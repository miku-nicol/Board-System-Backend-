const userService = require("./userService")

const register = async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;

    const token = await userService.registerUser(
      name,
      phoneNumber,
      email,
      password
    )

    return res.status(201).json({
      success: true,
      data: { accessToken: token },
      message: "User registration successful"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await userService.loginUser(
      email,
      password
    )

    return res.status(200).json({
      success: true,
      data: { accessToken: token },
      message: "Login successful"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { register, login };