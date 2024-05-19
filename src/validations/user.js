const Joi = require('joi');
const jwt = require('jsonwebtoken');

function combineErrors(validation) {
  const errors = {};
  for (const errorDetail of validation.error.details) {
    const path = errorDetail.path.join('.');
    errors[path] = errorDetail.message;
  }
  return errors;
}

function verifyToken(req, res, next) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Please log in to your account' });
  }

  try {
    const validToken = jwt.verify(token, process.env.JWT_SECRET);;
    console.log(validToken);
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
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
  .max(255)
  .messages({
    'string.empty': 'Email cannot be empty',
    'string.max': 'Email cannot exceed 255 characters',
    'string.email': 'Invalid email format. The top-level domain must be one of "com", "net", "org" or "mx"'
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
  username: usernameSchema.required().messages({
    'any.required': 'Username is required'
  }),
  email: emailSchema.required().messages({
    'any.required': 'Email is required'
  }),
  password: passwordSchema.required().messages({
    'any.required': 'Password is required'
  }),
  passwordConfirmation: passwordConfirmationSchema.required().messages({
    'any.required': 'Password confirmation is required'
  })
});

const userLoginSchema = Joi.object({
  username: usernameSchema.required().messages({
    'any.required': 'Username is required'
  }),
  password: passwordSchema.required().messages({
    'any.required': 'Password is required'
  })
});

const validateLogin = data => {
  const validation = userLoginSchema.validate(data, { abortEarly: false });
  return validation.error ? combineErrors(validation) : null;
};

const validateSignup = data => {
  const validation = userSignupSchema.validate(data, { abortEarly: false });
  return validation.error ? combineErrors(validation) : null;
};

module.exports = { validateLogin, validateSignup, verifyToken };