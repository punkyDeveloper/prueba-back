import { Request, Response } from 'express';

import Usuarios from '../models/registrar';

// Interfaz personalizada para la solicitud
interface CustomRequest extends Request {
  body: {
    name?: string;
    correo?: string;
    contrasena?: string;
    nombre?: string;
  };
  params: {
    id: string;
  };
}

// Función para registrar un nuevo usuario
export const Registrar = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { name, correo, contrasena } = req.body;

    if (!name || !correo || !contrasena) {
      res.status(400).json({ error: 'Por favor ingresa todos los datos.' });
      return;
    }

    const existingUser = await Usuarios.findOne({ email: correo });

    if (existingUser) {
      res.status(400).json({ error: 'El correo ya está registrado. Por favor usa otro.' });
      return;
    }

    const newUser = new Usuarios({
      fullName: name,
      email: correo,
      password: contrasena,
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario registrado correctamente!',
      user: newUser,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar el usuario.' });
  }
};

// Función para actualizar un usuario
export const actualizarUsuario = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, correo, contrasena } = req.body;

  try {
    const user = await Usuarios.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (nombre) user.fullName = nombre;
    if (correo) user.email = correo;
    if (contrasena) {
      user.password = contrasena; // Aquí deberías encriptar la contraseña
    }

    const updatedUser = await user.save();
    res.status(200).json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }
};

// Función para eliminar un usuario
export const eliminarUsuario = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await Usuarios.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente', user: deletedUser });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
  }
};

// Función para obtener la información de un usuario por su ID
export const obtenerUsuario = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const usuario = await Usuarios.findById(id);

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};
