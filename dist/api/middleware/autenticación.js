"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    let token;
    // Verifica si el token viene en los headers con el formato Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Obtiene el token después de 'Bearer'
    }
    if (!token) {
        // Si no hay token, deniega acceso
        res.status(401).json({ message: 'No autorizado, no se encontró token.', token: null });
        return;
    }
    try {
        // Verifica el token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está definido en el entorno.');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // Decodifica el JWT
        // Debug: Muestra el token decodificado
        console.log('Token decodificado:', decoded);
        // Extraer el `usuarioId` del token
        const usuarioId = decoded.usuarioId; // Verificamos que el `usuarioId` esté en el payload
        if (!usuarioId) {
            res.status(403).json({ message: 'Acceso denegado. No se encontró un usuarioId en el token.', token });
            return;
        }
        // Asignar el usuarioId decodificado a `req.user` para que esté disponible en las siguientes funciones
        req.user = { usuarioId };
        next(); // Pasa al siguiente middleware o controlador
    }
    catch (error) {
        // Manejo de errores de JWT (token expirado, token inválido)
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: 'Token expirado.', token: null });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: 'Token inválido.', token: null });
            return;
        }
        // En caso de cualquier otro error
        console.error('Error al verificar el token:', error); // Log del error
        res.status(401).json({ message: 'No autorizado, error en el token.', token: null });
        return;
    }
};
exports.protect = protect;
