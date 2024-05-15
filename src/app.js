const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");

const app = express();

// Configurar EJS como motor de pantallas
app.set("view engine", "ejs");
app.set("views", "./src/views");
//libreria para el manejo de layouts
app.use(expressLayouts);
app.set('layout', 'layouts/mainLayout'); 


// Rutas virtuales y middleware
app.use("/public", express.static(__dirname + "/../public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use(userRoutes);
app.use(bookRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Acceso correcto a MongoDB"))
  .catch((error) => console.error("Error conectando a MongoDB:", error));

module.exports = app;
