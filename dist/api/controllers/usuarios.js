"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerUsuario = exports.eliminarUsuario = exports.actualizarUsuario = exports.Registrar = void 0;
const registrar_1 = __importDefault(require("../models/registrar"));
// Función para registrar un nuevo usuario
const Registrar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, correo, contrasena } = req.body;
        if (!name || !correo || !contrasena) {
            res.status(400).json({ error: 'Por favor ingresa todos los datos.' });
            return;
        }
        const existingUser = yield registrar_1.default.findOne({ email: correo });
        if (existingUser) {
            res.status(400).json({ error: 'El correo ya está registrado. Por favor usa otro.' });
            return;
        }
        const newUser = new registrar_1.default({
            fullName: name,
            email: correo,
            password: contrasena,
        });
        yield newUser.save();
        res.status(201).json({
            message: 'Usuario registrado correctamente!',
            user: newUser,
        });
    }
    catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Ocurrió un error al registrar el usuario.' });
    }
});
exports.Registrar = Registrar;
// Función para actualizar un usuario
const actualizarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, correo, contrasena } = req.body;
    try {
        const user = yield registrar_1.default.findById(id);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        if (nombre)
            user.fullName = nombre;
        if (correo)
            user.email = correo;
        if (contrasena) {
            user.password = contrasena; // Aquí deberías encriptar la contraseña
        }
        const updatedUser = yield user.save();
        res.status(200).json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
    }
    catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
});
exports.actualizarUsuario = actualizarUsuario;
// Función para eliminar un usuario
const eliminarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedUser = yield registrar_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente', user: deletedUser });
    }
    catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
});
exports.eliminarUsuario = eliminarUsuario;
// Función para obtener la información de un usuario por su ID
const obtenerUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const usuario = yield registrar_1.default.findById(id);
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json(usuario);
    }
    catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});
exports.obtenerUsuario = obtenerUsuario;
