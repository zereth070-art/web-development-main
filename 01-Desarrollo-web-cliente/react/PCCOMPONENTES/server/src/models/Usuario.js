import mongoose from "mongoose";

/*
 * Esquema de Usuario.
 *
 * `select: false` en password: por defecto NO viene en las búsquedas, así que
 * un `Usuario.findOne()` normal te devuelve el usuario SIN contraseña. Es una
 * red de seguridad: si te olvidas de pedirla, no la recibes en vez de
 * devolverla sin querer por una respuesta.
 * Para compararla hay que pedirla a mano con `.select("+password")`.
 *
 * `lowercase: true` normaliza a minúsculas al guardar. Aun así normaliza
 * TAMBIÉN en la ruta antes de buscar: si solo normalizas al guardar, la
 * comprobación de duplicados se haría con el formato original.
 */
const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

export const Usuario = mongoose.model("Usuario", usuarioSchema);
