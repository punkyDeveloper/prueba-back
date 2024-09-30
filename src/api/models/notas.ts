import mongoose, { Schema, model, models } from "mongoose";

const NotasSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  nota: {
    type: String,
    required: true,
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia a un ID de usuario
    required: true,
    ref: 'Usuario' // Relaciona con la colección 'Usuario'
  }
});

// Exporta el modelo, asegurándote de que no se cree más de una vez
export default models.Notas || model('Notas', NotasSchema);

