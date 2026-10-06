import "./OffCanvas.css";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

function OffCanvasCats() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [errorCarga, setErrorCarga] = useState(false);
  const navigate = useNavigate();

  /* useEffect() con array de dependencias VACIO: la funcion se ejecuta UNA
     sola vez, al montar el componente. Es el momento de pedir los datos
     al servidor. Si el array tuviera variables, se repetiria cada vez que
     alguna de ellas cambie. */
  useEffect(() => {
    fetch("/api/categorias") // Vite reenvía esto a http://localhost:3000
      .then((resp) => {
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json();
      })
      .then((datos) => setCategorias(datos))
      .catch((err) => {
        console.error("error cargando las categorias:", err);
        setErrorCarga(true);
      });
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada === "") return;
    console.log("categoria seleccionada:", categoriaSeleccionada);
    window.alert("has seleccionado la categoria " + categoriaSeleccionada);
  }, [categoriaSeleccionada]);

  return (
    <div className="mt-5 mb-4">
      <button
        className="btn btn-outline-secondary"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      >
        <i className="fa-solid fa-bars"></i> Todas las categorias
      </button>

      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabIndex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
            Campañas y ofertas
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <hr></hr>

        <div className="offcanvas-body">
          <h3>
            <strong>Categorias</strong>
          </h3>

          {errorCarga && (
            <p className="text-danger">
              No se han podido cargar las categorias. ¿Está el server de
              Express arrancado en el puerto 3000?
            </p>
          )}

          {!errorCarga && categorias.length === 0 && <p>Cargando categorias...</p>}

          <div className="list-group">
            {categorias.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                className="list-group-item list-group-item-action"
                onClick={() => {
                  navigate(`/Productos/Categoria?categoria=${cat.nombre}`);
                  setCategoriaSeleccionada(cat.slug);
                }}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OffCanvasCats;
