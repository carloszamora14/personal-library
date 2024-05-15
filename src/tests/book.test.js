const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server'); //
const app = require('../app'); //Archivo aparte si la inicializacion automatica del servidor 
const Book = require('../models/books') //indicar el modelo de la bd para su instancia

describe('POST /gestionatebooks', () => {
  let mongoServer;

  /* Se realiza la conexión con la base de datos. 
  Primero se cierra cualquier conexion que haya establecido anteriormente */
  beforeAll(async () => {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log(mongoUri);
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a new book and respond with the gestionatebooks page', async () => {
    const newBook = {
      title: 'Test Book',
      author: 'Author Test',
      genre: 'Test Genre',
      status: 'Available'
    };

    const response = await request(app)
      .post('/gestionatebooks')
      .send(newBook)
      .expect(200);

    // Verificar que se responda con la página correcta. 
    expect(response.text).toContain('Gestionate your books');

    // verificar que el libro se ha guardado en la base de datos
    const savedBook = await Book.findOne({ title: 'Test Book' });
    expect(savedBook).toBeTruthy();
    expect(savedBook.author).toBe('Author Test');
  });
});
