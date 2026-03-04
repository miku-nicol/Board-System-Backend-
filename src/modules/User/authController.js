const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("./userModel");

const register = async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;

    
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or Phone Number already used"
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword
    });

    const jwtToken = jwt.sign(
      { userId: user._id },
    process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      success: true,
      data: { accessToken: jwtToken },
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

    
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      data: { accessToken: jwtToken },
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