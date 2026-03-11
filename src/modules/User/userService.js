const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("./userRepository");

const registerUser = async (name, phoneNumber, email, password) => {
    
    const existingUser = await userRepository.findByEmailOrPhone(email, phoneNumber);

    if (existingUser) {
        throw new Error("Email or Phone Number already used");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({
        name,
        email,
        phoneNumber,
        password: hashedPassword
    });

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return token;
}


const loginUser = async (email, password) => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error("Invaild email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error("Invaild email or password");
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d"}

    )

    return token;
};

module.exports = { registerUser, loginUser }