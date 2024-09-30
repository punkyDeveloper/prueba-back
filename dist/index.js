"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const conection_1 = require("./api/db/conection");
const router_1 = __importDefault(require("./api/routes/router"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config(); // Carga las variables de entorno desde el archivo .env
const app = (0, express_1.default)();
const port = process.env.PORT || 3002;
// Conectar a la base de datos MongoDB
(0, conection_1.connectDB)();
// Middleware para parsear JSON en las solicitudes
app.use(express_1.default.json());
// Configurar CORS
if (process.env.CORS === 'development') {
    app.use((0, cors_1.default)({
        origin: 'http://localhost:5173', // URL de tu frontend en desarrollo
    }));
}
else {
    app.use((0, cors_1.default)({
        origin: 'https://miapp.com', // URL de tu dominio de producción
    }));
}
// Usar el enrutador para las rutas
app.use('/', router_1.default);
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
