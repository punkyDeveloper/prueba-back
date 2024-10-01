import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { usuarioId: string }; // Extiende `Request` para incluir el `usuarioId` en `req.user`
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token: string | undefined;

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload; // Decodifica el JWT
    
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


    
    next(); 
  } catch (error) {
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expirado.', token: null });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Token inválido.', token: null });
      return;
    }

    // En caso de cualquier otro error
    console.error('Error al verificar el token:', error); // Log del error
    res.status(401).json({ message: 'No autorizado, error en el token.', token: null });
    return;
  }
};

