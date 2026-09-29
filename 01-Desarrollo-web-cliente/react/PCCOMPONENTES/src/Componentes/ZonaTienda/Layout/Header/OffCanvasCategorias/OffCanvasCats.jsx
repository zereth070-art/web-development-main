import "./OffCanvas.css";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

function OffCanvasCats() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  useEffect(); /*<------ hook useEffect() es una funcion js que admite como parametros
                        -una funcion que se a a ejecutar siempre y cuando
                        se cambia el valor de la variable de alguna de las variables
                        que se definen com dependencias de efecto
                        2º parametro: un array de variables que al modificar su valor por cualquier motivo
                        (evento, cambio de estado, ... )
                        provocara que se ejecute la funcion definida en el 1º parametro

                        OJO!!! si el array esta vacio, la funcion del 1º parametro se ejecutara una sola vez
                        al montar el componente y nunca mas
                        */

  useEffect(() => {
    console.log;
    window.alert("has seleccionado la categoria " + categoriaSeleccionada);
  }, [categoriaSeleccionada]);
  const navigate = useNavigate();

  return (
    <div className="mt-5 mb-4">
      <button
        className="btn btn-otuline-secondary"
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
          <p>....cargar categorias principales invocando a servicio....</p>
          <div class="list-group">
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() =>
                navigate("/Productos/Categoria?categoria=Componentes")
              }
            >
              Componentes
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => {
                navigate("/Productos/Categoria?categoria=Ordenadores");
                setCategoriaSeleccionada("ordenadores");
              }}
            >
              Ordenadores
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => {
                navigate("/Productos/Categoria?categoria=Perifericos");
                setCategoriaSeleccionada("perifericos");
              }}
            >
              Perifericos
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => {
                navigate("/Productos/Categoria?categoria=Consolas");
                setCategoriaSeleccionada("consolas");
              }}
            >
              Consolas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OffCanvasCats;
