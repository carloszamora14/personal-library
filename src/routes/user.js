const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/users");
const { validateLogin, validateSignup } = require("../validations/user");

function formatError(global, validation) {
  const result = { errors: {} };

  if (global) {
    result.errors.global = global;
  }

  if (validation) {
    result.errors.inputValidation = validation;
  }

  return result;
}

//create user
router.get("/login", (req, res) => {
  res.render("pages/index.ejs");
});

router.get("/signup", (req, res) => {
  res.render("pages/signup.ejs");
});

router.post("/auth/signup", async (req, res) => {
  const validationErrors = validateSignup(req.body);

  if (validationErrors) {
    return res.status(400).json(formatError(null, validationErrors));
  }

  try {
    const userAlreadyExists = await User.findOne({ username: req.body.username });

    if (userAlreadyExists) {
      return res.status(400).json(formatError("Username is already registered", null));
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: password
    });

    const { _id: userId } = await newUser.save();
    return res.status(201).json({ errors: null, data: { userId } });
  } catch (err) {
    return res.status(500).json(formatError("An unexpected error occurred. Please try again", null));
  }
});

router.post("/auth/login", async (req, res) => {
  const validationErrors = validateLogin(req.body);

  if (validationErrors) {
    return res.status(400).json(formatError(null, validationErrors));
  }

  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).json(formatError("Invalid login credentials", null));
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(400).json(formatError("Invalid login credentials", null));
    }

    const token = jwt.sign({
      username: user.username,
      id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ error: null, data: { token } });
  } catch (err) {
    return res.status(500).json(formatError("An unexpected error occurred. Please try again", null));
  }
});

module.exports = router;
