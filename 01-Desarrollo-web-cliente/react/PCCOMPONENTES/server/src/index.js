import "dotenv/config";
import { crearApp } from "./app.js";
import { conectarDB } from "./config/db.js";
import { Categoria } from "./models/Categoria.js";

const PORT = process.env.PORT ?? 3000;
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/pccomponentes";

try {
  // 1. conectar a la base ANTES de escuchar: si Mongo no está vivo, el
  //    server cae aquí con un mensaje claro en vez de aceptar peticiones
  //    que van a fallar todas
  await conectarDB(MONGO_URI);

  // 2. sincronizar índices a propósito: unique: true declara la intención,
  //    esto construye el índice de verdad (también con autoIndex off)
  await Categoria.syncIndexes();

  // 3. ya sí: escuchar peticiones
  crearApp().listen(PORT, () => {
    console.log(`[api] escuchando en http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("[api] no se ha podido arrancar:", err.message);
  process.exit(1);
}
