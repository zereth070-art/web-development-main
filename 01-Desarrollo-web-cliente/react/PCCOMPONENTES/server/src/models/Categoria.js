import mongoose from "mongoose";

/*
 * Esquema de Categoria. OJO al modo estricto de mongoose (por defecto ON):
 * si en el código intentas guardar un campo que NO está aquí, mongoose lo
 * IGNORA EN SILENCIO y el dato se pierde sin error. Escribe el campo en el
 * esquema antes de usarlo.
 */
const categoriaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    // unique declara una INTENCIÓN de índice único, no lo garantiza por sí
    // solo: por eso index.js llama a syncIndexes() al arrancar.
    slug: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

export const Categoria = mongoose.model("Categoria", categoriaSchema);
