const express = require("express");
const router = express.Router();
const Book = require('../models/books')

router.get('/home', (req,res)=>{
  res.render('pages/home.ejs')
})

router.get('/allbooks', (req,res)=>{
  res.render('pages/allbooks.ejs')
})

router.get('/gestionatebooks', (req,res)=>{
  res.render('pages/gestionatebooks.ejs')
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