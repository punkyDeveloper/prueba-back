import { Request, Response } from 'express';
import Notas from '../models/notas';

// Crear una nueva nota
export const crearNota = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, nota, usuarioId } = req.body;
    console.log(nombre)
    console.log(nota)
    console.log(usuarioId)
    if (!nombre || !nota || !usuarioId) {
      res.status(400).json({ error: 'Faltan datos' });
      return;
    }

    const nuevaNota = new Notas({
      nombre,
      nota,
      usuarioId,
    });

    await nuevaNota.save();

    res.status(201).json({ message: 'Nota creada correctamente', nota: nuevaNota });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la nota', details: error });
  }
};

// Obtener todas las notas
export const obtenerNotas = async (req: Request, res: Response): Promise<void> => {
  try {
    const notas = await Notas.find();
    res.status(200).json(notas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las notas', details: error });
  }
};

// Obtener una nota por ID
export const obtenerNotaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const nota = await Notas.findById(id);

    if (!nota) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    res.status(200).json(nota);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la nota', details: error });
  }
};

// Actualizar una nota por ID
export const actualizarNota = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, nota } = req.body;

    const notaActualizada = await Notas.findByIdAndUpdate(id, { nombre, nota }, { new: true });

    if (!notaActualizada) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Nota actualizada correctamente', nota: notaActualizada });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la nota', details: error });
  }
};


// Eliminar una nota por ID
export const eliminarNota = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const notaEliminada = await Notas.findByIdAndDelete(id);

    if (!notaEliminada) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Nota eliminada correctamente', nota: notaEliminada });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la nota', details: error });
  }
};
export const obtenerNotasPorUsuarioId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Aquí obtendremos el ID del usuario
    const notas = await Notas.find({ usuarioId: id }); 

    console.log('User ID:', id); // Log del ID del usuario

    if (!notas.length) {
      res.status(404).json({ error: 'No se encontraron notas para este usuario' });
      return;
    }

    res.status(200).json(notas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las notas', details: error });
  }
};