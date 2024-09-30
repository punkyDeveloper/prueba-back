import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './api/db/conection'; 
import router from './api/routes/router';
import cors from 'cors';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const app = express();
const port = process.env.PORT || 3002;

// Conectar a la base de datos MongoDB
connectDB();

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Configurar CORS
app.use(cors({
  origin: [
      'http://localhost:5173', // Permite desarrollo local
      'https://front-prueba-three.vercel.app', // Permite el frontend en producción
      'https://vercel.com/punkydevelopers-projects/front-prueba', // Permite el origen adicional si es necesario
      'https://front-prueba-a15w.vercel.app/'
      ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true // Si necesitas enviar cookies o autenticación
}));


// Usar el enrutador para las rutas
app.use('/', router);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
export default app;