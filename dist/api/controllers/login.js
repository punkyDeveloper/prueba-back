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
exports.login = void 0;
const registrar_1 = __importDefault(require("../models/registrar"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Verifica que el email y password estén presentes
    if (!email || !password) {
        res.status(400).json({ message: 'Por favor, ingrese ambos email y contraseña.' });
        return;
    }
    try {
        // Busca al usuario por email
        const user = yield registrar_1.default.findOne({ email });
        // Debug: Verifica si se encontró el usuario
        console.log('Usuario encontrado:', user);
        if (!user) {
            res.status(400).json({ message: 'Usuario no encontrado.' });
            return;
        }
        // Comparar directamente la contraseña (lógica simplificada, pero idealmente usarías bcrypt)
        if (user.password !== password) {
            res.status(400).json({ message: 'Contraseña incorrecta.' });
            return;
        }
        // Si la contraseña es correcta, crea un JWT que incluya el `id` del usuario
        const token = jsonwebtoken_1.default.sign({ usuarioId: user._id }, // Incluir el `usuarioId` en el payload del token
        process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: { id: user._id, email: user.email }, // Puedes enviar el `id` y email como referencia
        });
    }
    catch (error) {
        // Log de error
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});
exports.login = login;
