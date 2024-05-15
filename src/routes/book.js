const express = require("express");
const router = express.Router();
const Book = require('../models/books')
const expressLayouts = require('express-ejs-layouts');

router.get('/home', (req,res)=>{
  res.render('pages/home.ejs', {title:'Home'});
})

router.get('/allbooks', (req,res)=>{
  res.render('pages/allbooks.ejs', {title:'All books'}); 
})

router.get('/gestionatebooks', (req,res)=>{
  res.render('pages/gestionatebooks.ejs', {title:'Gestionate books'})
})

router.post('/gestionatebooks', async (req, res) => {
  try {
    const newBook = new Book({
      title:req.body.title, 
      author:req.body.author,
      genre:req.body.genre, 
      status:req.body.status
    });

    const bookSaved =  await newBook.save();  
    console.log(bookSaved); 
    /*const Books = await Book.find({});*/
    res.render('pages/gestionatebooks.ejs');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;