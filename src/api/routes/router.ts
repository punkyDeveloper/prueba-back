import { Router } from 'express';

import { Registrar, actualizarUsuario, eliminarUsuario, obtenerUsuario } from '../controllers/usuarios';
import { crearNota, obtenerNotas, obtenerNotasPorUsuarioId, actualizarNota, eliminarNota, obtenerNotaPorId } from '../controllers/notas';
import { login } from '../controllers/login';
import { protect } from '../middleware/autenticación';
// eslint-disable-next-line new-cap
// const router = express.Router();
const router = Router();
// Ruta para registrar un nuevo usuario
router.post('/registrar', Registrar);

// Ruta para actualizar un usuario por su ID
router.put('/actualizar/:id', actualizarUsuario);

// Ruta para eliminar un usuario por su ID
router.delete('/eliminar/:id', eliminarUsuario);

// Ruta para obtener un usuario por su ID (faltaba el parámetro ID)
router.get('/usuario/:id', obtenerUsuario);



// Notas
router.post('/notasCrear',  crearNota); // Crear una nota (ajustado el nombre a `/notas`)
router.get('/notas', obtenerNotas); // Obtener todas las notas
router.get('/notas/usuario/:id', obtenerNotasPorUsuarioId);
router.get('/notas/nota/:id', obtenerNotaPorId);
router.put('/notas/actualizar/:id', actualizarNota); // Actualizar una nota por ID 
router.delete('/notas/:id', eliminarNota); // Eliminar una nota por ID

// Ruta de login
router.post('/login', login);

// Ruta protegida
router.get('/privada', protect);


export default router; 
