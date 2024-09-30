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
exports.obtenerNotasPorUsuarioId = exports.eliminarNota = exports.actualizarNota = exports.obtenerNotaPorId = exports.obtenerNotas = exports.crearNota = void 0;
const notas_1 = __importDefault(require("../models/notas"));
// Crear una nueva nota
const crearNota = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, nota, usuarioId } = req.body;
        console.log(nombre);
        console.log(nota);
        console.log(usuarioId);
        if (!nombre || !nota || !usuarioId) {
            res.status(400).json({ error: 'Faltan datos' });
            return;
        }
        const nuevaNota = new notas_1.default({
            nombre,
            nota,
            usuarioId,
        });
        yield nuevaNota.save();
        res.status(201).json({ message: 'Nota creada correctamente', nota: nuevaNota });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear la nota', details: error });
    }
});
exports.crearNota = crearNota;
// Obtener todas las notas
const obtenerNotas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notas = yield notas_1.default.find();
        res.status(200).json(notas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener las notas', details: error });
    }
});
exports.obtenerNotas = obtenerNotas;
// Obtener una nota por ID
const obtenerNotaPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const nota = yield notas_1.default.findById(id);
        if (!nota) {
            res.status(404).json({ error: 'Nota no encontrada' });
            return;
        }
        res.status(200).json(nota);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener la nota', details: error });
    }
});
exports.obtenerNotaPorId = obtenerNotaPorId;
// Actualizar una nota por ID
const actualizarNota = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre, nota } = req.body;
        const notaActualizada = yield notas_1.default.findByIdAndUpdate(id, { nombre, nota }, { new: true });
        if (!notaActualizada) {
            res.status(404).json({ error: 'Nota no encontrada' });
            return;
        }
        res.status(200).json({ message: 'Nota actualizada correctamente', nota: notaActualizada });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar la nota', details: error });
    }
});
exports.actualizarNota = actualizarNota;
// Eliminar una nota por ID
const eliminarNota = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const notaEliminada = yield notas_1.default.findByIdAndDelete(id);
        if (!notaEliminada) {
            res.status(404).json({ error: 'Nota no encontrada' });
            return;
        }
        res.status(200).json({ message: 'Nota eliminada correctamente', nota: notaEliminada });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar la nota', details: error });
    }
});
exports.eliminarNota = eliminarNota;
const obtenerNotasPorUsuarioId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Aquí obtendremos el ID del usuario
        const notas = yield notas_1.default.find({ usuarioId: id }); // Asegúrate de que el esquema de Notas tenga un campo `userId`
        console.log('User ID:', id); // Log del ID del usuario
        if (!notas.length) {
            res.status(404).json({ error: 'No se encontraron notas para este usuario' });
            return;
        }
        res.status(200).json(notas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener las notas', details: error });
    }
});
exports.obtenerNotasPorUsuarioId = obtenerNotasPorUsuarioId;
