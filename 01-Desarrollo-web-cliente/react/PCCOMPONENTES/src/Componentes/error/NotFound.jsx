import { Link } from "react-router";

function NotFound() {
  return (
    <section className="text-center mt-5">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link className="btn btn-primary" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}

export default NotFound;