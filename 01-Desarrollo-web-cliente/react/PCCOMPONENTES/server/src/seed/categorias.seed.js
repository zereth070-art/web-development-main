import "dotenv/config";
import mongoose from "mongoose";
import { Categoria } from "../models/Categoria.js";

/*
 * Las 4 categorías que estaban hardcodeadas en OffCanvasCats.jsx.
 * Se insertan con upsert ("si existe actualiza, si no crea"), así que el
 * seed es IDEMPOTENTE: puedes ejecutarlo las veces que quieras y nunca
 * crea duplicados.
 */
const categorias = [
  { nombre: "Componentes", slug: "componentes" },
  { nombre: "Ordenadores", slug: "ordenadores" },
  { nombre: "Perifericos", slug: "perifericos" },
  { nombre: "Consolas", slug: "consolas" },
];

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/pccomponentes";

try {
  await mongoose.connect(MONGO_URI);

  for (const categoria of categorias) {
    await Categoria.updateOne(
      { slug: categoria.slug },
      { $set: categoria },
      { upsert: true },
    );
  }

  const guardadas = await Categoria.find().sort({ nombre: 1 });
  console.log(`[seed] ${guardadas.length} categorias en la base:`);
  guardadas.forEach((c) => console.log(`  - ${c.nombre} (${c.slug})`));
} catch (err) {
  console.error("[seed] error:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
