const express = require("express");
const router = express.Router();

//create user
router.get("/login", (req, res) => {
  res.render("pages/index.ejs");
});

router.get("/signup", (req, res) => {
  res.render("pages/signup.ejs");
});

router.post("/users", (req, res) => {
  console.log(req.body);
  res.end();
});

module.exports = router;
