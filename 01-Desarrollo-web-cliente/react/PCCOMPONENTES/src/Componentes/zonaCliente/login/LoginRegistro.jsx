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

  function enviar(ev) {
    ev.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      setExito(
        esRegistro
          ? "Registro completado correctamente. (pendiente de backend)"
          : "Sesión iniciada correctamente. (pendiente de backend)",
      );
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
        <button type="submit" className="btn btn-primary mt-3">
          {esRegistro ? "Registrarse" : "Entrar"}
        </button>
      </form>
    </section>
  );
}

export default LoginRegistro;