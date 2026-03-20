const userService = require("./userService")

const register = async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;

    if (!name || !phoneNumber || !email || !password) {
      logger.warn({
        message: "Registration validation failed",
        email,
        userInput: { name, phoneNumber }
      });

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }


    const token = await userService.registerUser(
      name,
      phoneNumber,
      email,
      password
    );

    logger.info({
      message: "User registered successfully",
      email
    });

    return res.status(201).json({
      success: true,
      data: { accessToken: token },
      message: "User registration successful"
    });

  } catch (error) {
        logger.error({
      message: "Registration failed",
      email: req.body?.email,
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.warn({
        message: "Login validation failed",
        email
      });

      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const token = await userService.loginUser(
      email,
      password
    )

    logger.info({
      message: "User login successful",
      email
    });

    return res.status(200).json({
      success: true,
      data: { accessToken: token },
      message: "Login successful"
    });

  } catch (error) {
    logger.warn({
      message: "Login failed",
      email: req.body?.email,
      error: error.message
    });


    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = { register, login };