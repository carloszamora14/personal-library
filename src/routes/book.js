const express = require("express");
const router = express.Router();
const Book = require('../models/books')
const expressLayouts = require('express-ejs-layouts');
const books = require("../models/books");

router.get('/home', (req,res)=>{
  res.render('pages/home.ejs', {title:'Home'});
})

router.get('/allbooks', async (req,res)=>{
  const Books = await Book.find({});
  res.render('pages/allbooks.ejs', {title:'All books', Books}); 
})

router.get('/gestionatebooks', async (req,res)=>{
  const Books = await Book.find({});
  res.render('pages/gestionatebooks.ejs', {title:'Gestionate books', Books})
})

//Edit book
router.get('/findbook/:id', async(req,res)=>{
  try {
    const book = await Book.findById(req.params.id);
    !book ? res.status(404).send('Book not found') : res.status(200).send(book);
    
  } catch (error) {
    res.status(500).send(error);
  }
});

//Update book
router.put('/updatebook/:id', async(req,res)=>{
  try {
    const book = await Book.findByIdAndUpdate (req.params.id, req.body, {new:true});
    !book ? res.status(404).send('Book not found') : res.status(200).send(book); 
  } catch (error) {
    res.status(500).send(error);
  }
}); 

//Add new book
router.post('/gestionatebooks', async (req, res) => {
  try {
    const newBook = new Book({
      title:req.body.title, 
      author:req.body.author,
      genre:req.body.genre, 
      status:req.body.status
    });

    await newBook.save(); 
    res.redirect('/gestionatebooks');
  } catch (error) {
    res.status(500).send(error);
  }
});



module.exports = router;