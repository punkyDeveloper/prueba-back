import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index'; // Asegúrate de que la ruta a tu aplicación sea correcta
import Notas from '../src/api/models/notas';
import { connectDB } from "../src/api/db/conection"; // Ajusta la ruta si es necesario
// Conectar a la base de datos antes de ejecutar las pruebas
beforeAll(async () => {
    const isConnected = await connectDB();
    if (!isConnected) {
      throw new Error("Failed to connect to MongoDB");
    }
  });
  
  // Desconectar de la base de datos después de ejecutar las pruebas
  afterAll(async () => {
    await mongoose.disconnect();
  });
  
  // Limpiar la colección antes de cada prueba
  beforeEach(async () => {
    await Notas.deleteMany({});
  });
  
  // Test para la API de Notas
  describe('Notas API', () => {
    it('debería crear una nueva nota', async () => {
      const respuesta = await request(app)
        .post('/notasCrear') // Cambia a la ruta correcta
        .send({
          nombre: 'Nota de prueba',
          nota: 'Este es el contenido de la nota',
          usuarioId: new mongoose.Types.ObjectId(), // Asumimos que este ID es válido
        });
  
      expect(respuesta.status).toBe(201);
      expect(respuesta.body.message).toBe('Nota creada correctamente');
      expect(respuesta.body.nota).toHaveProperty('_id');
      expect(respuesta.body.nota.nombre).toBe('Nota de prueba');
    });
  
    // Test para obtener todas las notas
    it('debería obtener todas las notas', async () => {
      await Notas.create({
        nombre: 'Nota 1',
        nota: 'Contenido de nota 1',
        usuarioId: new mongoose.Types.ObjectId(),
      });
      await Notas.create({
        nombre: 'Nota 2',
        nota: 'Contenido de nota 2',
        usuarioId: new mongoose.Types.ObjectId(),
      });
  
      const respuesta = await request(app).get('/notas');
  
      expect(respuesta.status).toBe(200);
      expect(respuesta.body.length).toBe(2);
    });
  
    // Test para obtener una nota por ID
    it('debería obtener una nota por ID', async () => {
      const nuevaNota = await Notas.create({
        nombre: 'Nota a buscar',
        nota: 'Contenido de la nota a buscar',
        usuarioId: new mongoose.Types.ObjectId(),
      });
  
      const respuesta = await request(app).get(`/notas/nota/${nuevaNota._id}`); // Ajusta la ruta aquí
  
      expect(respuesta.status).toBe(200);
      expect(respuesta.body).toHaveProperty('_id', nuevaNota._id.toString());
    });
  
    // Test para actualizar una nota
    it('debería actualizar una nota existente', async () => {
      const nuevaNota = await Notas.create({
        nombre: 'Nota a actualizar',
        nota: 'Contenido original',
        usuarioId: new mongoose.Types.ObjectId(),
      });
  
      const respuesta = await request(app)
        .put(`/notas/actualizar/${nuevaNota._id}`) // Ajusta la ruta aquí
        .send({
          nombre: 'Nota actualizada',
          nota: 'Contenido actualizado',
        });
  
      expect(respuesta.status).toBe(200);
      expect(respuesta.body.message).toBe('Nota actualizada correctamente');
      expect(respuesta.body.nota.nombre).toBe('Nota actualizada');
    });
  
    // Test para eliminar una nota
    it('debería eliminar una nota existente', async () => {
      const nuevaNota = await Notas.create({
        nombre: 'Nota a eliminar',
        nota: 'Contenido de la nota a eliminar',
        usuarioId: new mongoose.Types.ObjectId(),
      });
  
      const respuesta = await request(app).delete(`/notas/${nuevaNota._id}`); // Ajusta la ruta aquí
  
      expect(respuesta.status).toBe(200);
      expect(respuesta.body.message).toBe('Nota eliminada correctamente');
  
      const notaBuscada = await Notas.findById(nuevaNota._id);
      expect(notaBuscada).toBeNull();
    });
  });