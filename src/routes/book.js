const express = require("express");
const router = express.Router();

router.get('/home', (req,res)=>{
  res.render('pages/home.ejs')
})

module.exports = router;