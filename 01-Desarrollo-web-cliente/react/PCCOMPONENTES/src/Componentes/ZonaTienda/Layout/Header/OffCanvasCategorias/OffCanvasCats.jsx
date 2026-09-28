import "./OffCanvas.css";
import { useNavigate } from "react-router";

function OffCanvasCats() {
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
              class="list-group-item list-group-item-action"
              onClick={() =>
                navigate("/Productos/Categoria?categoria=Componentes")
              }
            >
              Componentes
            </button>
            <button
              type="button"
              class="list-group-item list-group-item-action"
              onClick={() =>
                navigate("/Productos/Categoria?categoria=Ordenadores")
              }
            >
              Ordenadores
            </button>
            <button
              type="button"
              class="list-group-item list-group-item-action"
              onClick={() =>
                navigate("/Productos/Categoria?categoria=Perifericos")
              }
            >
              Perifericos
            </button>
            <button
              type="button"
              class="list-group-item list-group-item-action"
              onClick={() =>
                navigate("/Productos/Categoria?categoria=Consolas")
              }
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
