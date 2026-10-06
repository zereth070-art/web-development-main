import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";
import { validarAuth } from "../middleware/validaciones.js";

export const routerAuth = Router();

// bcrypt es lento a propósito (~100 ms): ese coste es lo que hace caro un
// ataque por fuerza bruta. Subirlo hace más segura la base y más lenta la
// respuesta; bajarlo destruye la única protección que tenía.
const SALT_ROUNDS = 10;

/** Convierte una excepción en un error con la forma que entiende app.js. */
function httpError(status, codigo, mensaje) {
  const err = new Error(mensaje);
  err.status = status;
  err.codigo = codigo;
  return err;
}

/** En un JWT nunca va la contraseña, ni el hash. Solo identificadores. */
function firmarToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "2h" },
  );
}

function datosPublicos(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
}

/*
 * POST /api/auth/register
 *
 * Orden: validar -> normalizar -> comprobar duplicado -> hashear -> insertar.
 * El paso del duplicado es una cortesía para dar un mensaje amigable; la
 * garantía real es el índice único (y su E11000, convertido a 409 en
 * app.js). Este código seguiría siendo correcto sin ese chequeo.
 */
routerAuth.post(
  "/api/auth/register",
  validarAuth({ conNombre: true }),
  async (req, res) => {
    const email = req.body.email.trim().toLowerCase();

    const yaExiste = await Usuario.findOne({ email });
    if (yaExiste) {
      throw httpError(409, "EMAIL_DUPLICADO", "Ese email ya está registrado.");
    }

    // se hashea ANTES de insertar: nunca debe existir un momento en el que
    // la contraseña esté en la base en texto plano
    const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const usuario = await Usuario.create({
      nombre: req.body.nombre.trim(),
      email,
      password: hash,
    });

    res.status(201).json({
      ok: true,
      usuario: datosPublicos(usuario),
      token: firmarToken(usuario),
    });
  },
);

/*
 * POST /api/auth/login
 *
 * El mismo error (texto Y codigo) para "no existe" y "contraseña mala".
 * Si respondieras distinto, cualquiera podría descubrir qué emails tienen
 * cuenta en la tienda: sería un oráculo, no un login.
 */
routerAuth.post(
  "/api/auth/login",
  validarAuth({ conNombre: false }),
  async (req, res) => {
    const email = req.body.email.trim().toLowerCase();

    // password tiene select: false, así que sin esto llegaría undefined y
    // bcrypt.compare fallaría con un error que no menciona las contraseñas
    const usuario = await Usuario.findOne({ email }).select("+password");

    // un solo `if` para las dos causas: así es imposible que los mensajes
    // acaben distintos, que es justo la fuga que hay que evitar
    const correcta = usuario
      ? await bcrypt.compare(req.body.password, usuario.password)
      : false;

    if (!correcta) {
      throw httpError(401, "CREDENCIALES", "Credenciales incorrectas.");
    }

    res.json({
      ok: true,
      usuario: datosPublicos(usuario),
      token: firmarToken(usuario),
    });
  },
);
