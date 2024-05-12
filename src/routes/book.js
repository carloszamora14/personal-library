const express = require("express");
const router = express.Router();

router.get('/home', (req,res)=>{
  res.render('pages/home.ejs')
})

router.get('/allbooks', (req,res)=>{
  res.render('pages/allbooks.ejs')
})

router.get('/gestionatebooks', (req,res)=>{
  res.render('pages/gestionatebooks.ejs')
})

module.exports = router;