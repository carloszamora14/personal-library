const Joi = require('joi');

function combineErrors(validation) {
  const errors = {};
  for (const errorDetail of validation.error.details) {
    const path = errorDetail.path.join('.');
    errors[path] = errorDetail.message;
  }
  return errors;
}

const usernameSchema = Joi.string()
  .trim()
  .min(3)
  .max(30)
  .regex(/^\w+$/)
  .messages({
    'string.empty': 'Username cannot be empty',
    'string.pattern.base': 'Username can only contain letters, digits, and underscores',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters'
  });

const emailSchema = Joi.string()
  .trim()
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'mx'] } })
  .messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Invalid email format'
  });

const passwordSchema = Joi.string()
  .min(8)
  .max(60)
  .messages({
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password cannot exceed 60 characters'
  });

const passwordConfirmationSchema = Joi.string()
  .valid(Joi.ref('password'))
  .messages({
    'any.only': 'Passwords must match'
  });

const userSignupSchema = Joi.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  passwordConfirmation: passwordConfirmationSchema
});

const userLoginSchema = Joi.object({
  username: usernameSchema,
  password: passwordSchema
});

const validateLogin = data => {
  const validation = userLoginSchema.validate(data, { abortEarly: false });
  return validation.error ? combineErrors(validation) : null;
}

const validateSignup = data => {
  const validation = userSignupSchema.validate(data, { abortEarly: false });
  return validation.error ? combineErrors(validation) : null;
};

module.exports = { validateLogin, validateSignup };