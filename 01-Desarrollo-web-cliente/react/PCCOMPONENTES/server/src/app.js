import express from "express";
import { routerCategorias } from "./routes/categorias.js";

/*
 * La app de Express es una TUBERÍA de middlewares en orden. El orden es la
 * parte importante:
 *   1. parsers (sin express.json() no existe req.body)
 *   2. rutas
 *   3. 404
 *   4. middleware de errores (SIEMPRE el último)
 */
export function crearApp() {
  const app = express();

  // parsea el body JSON a req.body (si no, req.body es undefined)
  app.use(express.json());
  // extrae las variables del querystring/urlencoded a req.body
  app.use(express.urlencoded({ extended: true }));

  // health check: comprueba que la API viva sin tocar la base
  app.get("/api/health", (req, res) => {
    res.json({ ok: true });
  });

  // rutas de la API
  app.use(routerCategorias);

  // 404 en JSON para rutas que no existen (tiene que ir DESPUÉS de las rutas)
  app.use((req, res) => {
    res.status(404).json({
      error: { codigo: "NO_ENCONTRADO", mensaje: "Ruta no existente" },
    });
  });

  // middleware de errores: 4 PARÁMETROS (err, req, res, _next) y SIEMPRE al
  // final. El 4º parámetro es la firma que usa Express para distinguirlo de
  // un middleware normal: sin él, Express lo ignora.
  app.use((err, req, res, _next) => {
    console.error("[api] error:", err);
    const status = err.status ?? 500;
    res.status(status).json({
      error: {
        codigo: err.codigo ?? "ERROR_INTERNO",
        // al cliente nunca se le manda el stack trace: es un mapa de tu
        // sistema de ficheros regalado a cualquiera que lo lea
        mensaje: status === 500 ? "Error del servidor" : err.message,
      },
    });
  });

  return app;
}
