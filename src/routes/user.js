const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/users');
const { validateLogin, validateSignup, verifyToken } = require('../validations/user');

function templateVariables(userInput, validationErrors, globalError) {
  return {
    layout: false,
    userInput: userInput || {},
    validationErrors: validationErrors || {},
    globalError: globalError || ''
  };
}

router.get('/login', (req, res) => {
  res.render('pages/index.ejs', templateVariables());
});

router.get('/signup', (req, res) => {
  res.render('pages/signup.ejs', templateVariables());
});

router.post('/signup', async (req, res) => {
  const validationErrors = validateSignup(req.body);

  if (validationErrors) {
    return res.status(400).render('pages/signup.ejs', templateVariables(req.body, validationErrors));
  }

  try {
    const usernamePattern = new RegExp('^' + req.body.username + '$', 'i');
    const userAlreadyExists = await User.findOne({ username: { $regex: usernamePattern } });

    if (userAlreadyExists) {
      return res.status(400).render(
        'pages/signup.ejs',
        templateVariables(req.body, validationErrors, 'Username is already registered')
      );
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: password
    });

    await newUser.save();
    return res.redirect('/login');
  } catch (err) {
    return res.status(500).render(
      'pages/signup.ejs',
      templateVariables(req.body, validationErrors, 'An unexpected error occurred. Please try again')
    );
  }
});

router.post('/login', async (req, res) => {
  const validationErrors = validateLogin(req.body);

  if (validationErrors) {
    return res.status(400).render('pages/index.ejs', templateVariables(req.body, validationErrors));
  }

  try {
    const usernamePattern = new RegExp('^' + req.body.username + '$', 'i');
    const user = await User.findOne({ username: { $regex: usernamePattern } });

    if (!user) {
      return res.status(401).render(
        'pages/index.ejs',
        templateVariables(req.body, validationErrors, 'Invalid login credentials')
      );
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(401).render(
        'pages/index.ejs',
        templateVariables(req.body, validationErrors, 'Invalid login credentials')
      );
    }

    const token = jwt.sign({
      username: user.username,
      id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });

    return res.redirect('/home');
  } catch (err) {
    return res.status(500).render(
      'pages/index.ejs',
      templateVariables(req.body, validationErrors, 'An unexpected error occurred. Please try again')
    );
  }
});

module.exports = router;
