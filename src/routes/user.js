const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../models/users");
const { validateLogin, validateSignup } = require("../validations/user")

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
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const userAlreadyExists = await User.findOne({ username: req.body.username });

    if (userAlreadyExists) {
      return res.status(400).json({ error: "Username is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: password
    });

    const { _id: userId } = await newUser.save();
    return res.status(201).json({ error: null, data: userId })
  } catch (err) {
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
});

module.exports = router;
