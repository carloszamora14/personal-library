const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
require("dotenv").config();

const app = express();
const port = process.env.port || 3000;

//Configurar EJS como motor de pantallas
// <-- Se asigna el motor de vistas a la propiedad view engine: ejs
app.set("view engine", "ejs");
//Indica a la propiedad views donde encontrar losa archivos de las vistas
app.set("views", "./src/views");

// Rutas virtuales
app.use('/public', express.static(__dirname + '/../public'));


//middleware
app.use(userRoutes);
app.use(bookRoutes); 

//conexion a mongodb
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Acceso correcto");
  })
  .catch((error) => {
    console.error(error);
  });

app.listen(port, () => {
  console.log(`El servidor esta escuchando en el puerto ${port}`);
});
