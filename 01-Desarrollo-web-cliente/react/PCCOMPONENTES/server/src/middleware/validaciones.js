const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const MIN_PASSWORD = 6;
const MIN_NOMBRE = 3;

/*
 * Middleware de validación reutilizable.
 *
 * El navegador no es una frontera de seguridad: lo que valida tu React corre
 * en la máquina del usuario y se salta con la consola. Esto es la validación
 * que de verdad cuenta. La del frontend es comodidad, esta es requisito.
 *
 * Si algo falla, se manda el error con `next(err)` y no se responde aquí:
 * quien decide el formato de la respuesta es el middleware de errores de
 * app.js, que es el único sitio que hay que tocar para cambiarlo.
 */
export function validarAuth({ conNombre }) {
  return (req, res, next) => {
    // req.body puede ser undefined si no llegó body (o no hay express.json)
    const { nombre, email, password } = req.body ?? {};
    const fallos = [];

    if (conNombre && (typeof nombre !== "string" || nombre.trim().length < MIN_NOMBRE)) {
      fallos.push(`El nombre debe tener al menos ${MIN_NOMBRE} caracteres.`);
    }

    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      fallos.push("Introduce un email válido.");
    }

    if (typeof password !== "string" || password.length < MIN_PASSWORD) {
      fallos.push(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`);
    }

    if (fallos.length > 0) {
      const err = new Error(fallos.join(" "));
      err.status = 400;
      err.codigo = "VALIDACION";
      return next(err);
    }

    return next();
  };
}
