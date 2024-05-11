const express = require("express");
const router = express.Router();

//create user
router.get("/login", (req, res) => {
  res.render("pages/index.ejs");
});

module.exports = router;
