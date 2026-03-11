const userModel = require("./userModel")


const findByEmail = async(email) =>{
    return userModel.findOne({ email });
};

const findByEmailOrPhone = async(email, phoneNumber) => {
    return userModel.findOne({
        $or: [{email}, { phoneNumber }]
    });
};

const createUser = async (data) => {
    return userModel.create(data);
};

module.exports = { findByEmail, findByEmailOrPhone, createUser}