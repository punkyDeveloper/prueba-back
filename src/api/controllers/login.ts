import { Request, Response } from 'express';
import User from '../models/registrar';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Verifica que el email y password estén presentes
  if (!email || !password) {
    res.status(400).json({ message: 'Por favor, ingrese ambos email y contraseña.' });
    return;
  }

  try {
    // Busca al usuario por email
    const user = await User.findOne({ email });
    
    // Debug: Verifica si se encontró el usuario
    console.log('Usuario encontrado:', user);
    
    if (!user) {
      res.status(400).json({ message: 'Usuario no encontrado.' });
      return;
    }

    
    if (user.password !== password) {
      res.status(400).json({ message: 'Contraseña incorrecta.' });
      return;
    }

    // Si la contraseña es correcta, crea un JWT que incluya el `id` del usuario
    const token = jwt.sign(
      { usuarioId: user._id }, // Incluir el `usuarioId` en el payload del token
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user._id, email: user.email }, // Puedes enviar el `id` y email como referencia
    });
  } catch (error) {
    // Log de error
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};
