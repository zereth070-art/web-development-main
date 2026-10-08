import { useState } from "react";
import { validateEmail } from "../../../utils/validaciones.js";
import "./LoginRegistro.css";

const MIN_PASSWORD = 6;

function LoginRegistro() {
  // "login" o "registro" para alternar entre los dos formularios
  const [modo, setModo] = useState("registro");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    repetir: "",
  });
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState("");
  //estado de carga: mientras el fetch está en curso, se puede deshabilitar el botón de enviar y mostrar un spinner
  const [cargando, setCargando] = useState(false);
  // Mensaje de error devuelto por la API (por ejemplo, "email ya registrado" o "credenciales incorrectas")
  //separado de errores porque esos son de validacion local y estos vienen desde el SERVIDOR
  const [errorApi, setErrorApi] = useState("");
  const esRegistro = modo === "registro";

  const campos = [
    ...(esRegistro
      ? [
        {
          nombre: "nombre",
          type: "text",
          label: "Nombre de usuario:",
          placeholder: "Nombre*",
        },
      ]
      : []),
    {
      nombre: "email",
      type: "email",
      label: "Email:",
      placeholder: "Email*",
    },
    {
      nombre: "password",
      type: "password",
      label: "Contraseña:",
      placeholder: "Contraseña*",
    },
    ...(esRegistro
      ? [
        {
          nombre: "repetir",
          type: "password",
          label: "Repetir contraseña:",
          placeholder: "Repetir contraseña*",
        },
      ]
      : []),
  ];

  function changeCampo(ev) {
    const { nombre } = ev.target.dataset;
    setForm((prev) => ({ ...prev, [nombre]: ev.target.value }));
    setExito("");
  }

  function validar() {
    const nuevosErrores = {};

    if (esRegistro && form.nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!validateEmail(form.email)) {
      nuevosErrores.email = "Introduce un email válido.";
    }

    if (form.password.length < MIN_PASSWORD) {
      nuevosErrores.password = `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`;
    }

    if (esRegistro && form.repetir !== form.password) {
      nuevosErrores.repetir = "Las contraseñas no coinciden.";
    }

    return nuevosErrores;
  }
  async function enviar(ev) {
    ev.preventDefault(); // sin esto, el navegador recarga la página constantemente y se pierde el estado de React

    // 1) Validar los campos del formulario
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    //Si hay errores, no se envía el formulario
    if (Object.keys(nuevosErrores).length > 0) return;

    // 2) Validacion REMOTA: toca enviar los datos al servidor para que valide el email y la contraseña (login) o el email y el nombre (registro)
    setCargando(true);
    setErrorApi("");
    try {
      const endpoint = esRegistro ? "/api/auth/register" : "/api/auth/login";
      const datos = esRegistro ?
        { nombre: form.nombre, email: form.email, password: form.password } :
        { email: form.email, password: form.password };
      // repetir no se envía al servidor, solo se valida localmente
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos) //pasamos los datos de JSON a un string porque es asi como se envian los datos de body en un HTTP, luego lo volveremos a hacer JSON en el back
      });

      //El cuerpo de la respuesta de la API siempre se recibe, por lo que hay que volver a hacerlo JSON en el cliente
      const data = await res.json();
      // Si por lo que sea recibimos un error de la API, lo lanzamos para que el catch lo pille y lo muestre en pantalla.
      // data.error.mensaje es el mensaje de error que devuelve la API, si no hay, mostramos un mensaje genérico
      if (!res.ok) {
        throw new Error(data.error?.mensaje ?? "Error inesperado");
      }

      localStorage.setItem("token", data.token);
      // Si sale bien, se lo decimos al usuario con un mensaje de éxito. data.usuario.nombre es el nombre del usuario que devuelve la API
      setExito(`Bienvenido ${data.usuario.nombre}. Has iniciado sesión correctamente.`);

    } catch (err) {
      setErrorApi(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="form-container">
      <h1>
        {esRegistro
          ? "Registro de nuevo cliente"
          : "Inicio de sesión de cliente"}
      </h1>

      <div className="btn-group mb-3" role="group" aria-label="Modo de acceso">
        <button
          type="button"
          className={`btn ${esRegistro ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setModo("registro")}
        >
          Registro
        </button>
        <button
          type="button"
          className={`btn ${esRegistro ? "btn-secondary" : "btn-primary"}`}
          onClick={() => setModo("login")}
        >
          Login
        </button>
      </div>

      {exito && <div className="alert alert-success">{exito}</div>}
      {errorApi && <div className="alert alert-danger">{errorApi}</div>}
      <form onSubmit={enviar} noValidate>
        {campos.map((campo) => (
          <div key={campo.nombre}>
            <label className="form-label" htmlFor={campo.nombre}>
              {campo.label}
            </label>
            <input
              type={campo.type}
              id={campo.nombre}
              className="form-control"
              placeholder={campo.placeholder}
              data-nombre={campo.nombre}
              value={form[campo.nombre]}
              onChange={changeCampo}
            />
            {errores[campo.nombre] && (
              <small className="text-danger">{errores[campo.nombre]}</small>
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary mt-3" disabled={cargando}>
          {cargando ? "Procesando..." : esRegistro ? "Registrarse" : "Entrar"}
        </button>
      </form>
    </section>
  );
}


export default LoginRegistro;
