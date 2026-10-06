import mongoose from "mongoose";

/*
 * La conexión se hace AQUÍ y se espera a que ocurra ANTES de usar la base.
 * mongoose.connect() devuelve una promesa: si no conecta, RECHAZA y el
 * index.js la captura y cae con un mensaje limpio en el log (etapa 0 del
 * manual: "arrancar y caerse" en lugar de "arrancar y esperar en silencio").
 */
export async function conectarDB(uri) {
  mongoose.connection.on("connected", () => {
    console.log(`[db] conectado a ${uri}`);
  });

  mongoose.connection.on("error", (err) => {
    console.error("[db] error de conexion:", err.message);
  });

  await mongoose.connect(uri);
}
