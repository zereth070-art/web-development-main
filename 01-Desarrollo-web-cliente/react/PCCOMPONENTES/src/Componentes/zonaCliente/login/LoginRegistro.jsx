import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    repetir: "",
  });

  const campos = [
    {
      nombre: "nombre",
      type: "text",
      label: "Nombre de usuario:",
      placeholder: "Nombre*",
    },
    { nombre: "email", type: "email", label: "Email:", placeholder: "Email*" },
    {
      nombre: "password",
      type: "password",
      label: "Password:",
      placeholder: "Password*",
    },
    {
      nombre: "repetir",
      type: "password",
      label: "Repetir password:",
      placeholder: "Repetir contraseña*",
    },
  ];

  function changeCampo(ev) {
    const { nombre } = ev.target.dataset;
    console.log("evento change del input:", nombre, ev.target.value);
    setForm({ ...form, [nombre]: ev.target.value });
  }

  return (
    <>
      <h1>Vamos a comprobar lo que es el STATE de un componente de REACT</h1>
      <div className="m-4">
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
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
