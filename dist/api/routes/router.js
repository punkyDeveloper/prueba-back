"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_1 = require("../controllers/usuarios");
const notas_1 = require("../controllers/notas");
const login_1 = require("../controllers/login");
const autenticaci_n_1 = require("../middleware/autenticaci\u00F3n");
// eslint-disable-next-line new-cap
// const router = express.Router();
const router = (0, express_1.Router)();
// Ruta para registrar un nuevo usuario
router.post('/registrar', usuarios_1.Registrar);
// Ruta para actualizar un usuario por su ID
router.put('/actualizar/:id', usuarios_1.actualizarUsuario);
// Ruta para eliminar un usuario por su ID
router.delete('/eliminar/:id', usuarios_1.eliminarUsuario);
// Ruta para obtener un usuario por su ID (faltaba el parámetro ID)
router.get('/usuario/:id', usuarios_1.obtenerUsuario);
// Notas
router.post('/notasCrear', notas_1.crearNota); // Crear una nota (ajustado el nombre a `/notas`)
router.get('/notas', notas_1.obtenerNotas); // Obtener todas las notas
router.get('/notas/usuario/:id', notas_1.obtenerNotasPorUsuarioId);
router.get('/notas/nota/:id', notas_1.obtenerNotaPorId);
router.put('/notas/actualizar/:id', notas_1.actualizarNota); // Actualizar una nota por ID 
router.delete('/notas/:id', notas_1.eliminarNota); // Eliminar una nota por ID
// Ruta de login
router.post('/login', login_1.login);
// Ruta protegida
router.get('/privada', autenticaci_n_1.protect);
exports.default = router;
