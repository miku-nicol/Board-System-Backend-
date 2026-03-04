const joi = require("joi");

const userValidator = joi.object({
  name: joi.string().trim().required().messages({
    "string.base": "Name must be a text value",
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required"
  }),

  email: joi.string().trim().required().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "biz"] }
  }).messages({
    "string.base": "Email must be a valid string",
    "string.email": "Email must be a valid email address (.com only)",
    "any.required": "Email is required"
  }),

  password: joi.string().trim().required()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .messages({
      "string.pattern.base":
        "Password must be 3–30 characters and contain only letters and numbers",
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required"
    }),

  phoneNumber: joi.string().trim().required()
    .pattern(/^0[0-9]{10}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be 11 digits and start with 0",
      "string.empty": "Phone number cannot be empty",
      "any.required": "Phone number is required"
    })
});

module.exports = { userValidator };