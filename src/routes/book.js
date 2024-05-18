const express = require("express");
const router = express.Router();
const Book = require('../models/books')
const expressLayouts = require('express-ejs-layouts');

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

router.get('/findBook/:id', async(req,res)=>{
  try {
    const Books = await Book.findById(req.params.id)
    if(!Books){
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el libro:', error);
  }
  
});

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