import { useParams, useSearchParams } from "react-router";

//import { useParams } from "react-router";
function ProductosCat() {
  //hook para interceptar segmentos variables
  //const valorDevueltoUseParams = useParams();
  //console.log("valor devuelto del hook use params", valorDevueltoUseParams);

  //-- hook para interceptar valores variables por query string en la url
  const [ catComponentes ] = useParams();
  //console.log("lo que da el hook es", valorDevueltoPorHookUseSearchParams);
  const [searchParams, setSearchParams] = useSearchParams();
  console.log("valor 1", searchParams, "valor 2", setSearchParams);

  return (
    <div className="d-flex flex-row justify-content-center align-items-center ProductosCat">
      {/* <h3>Pagina de productos por categorias se carga dentro del layout</h3> */}
      <h3></h3>
      <p>Aqui mostrariamos los productos de {catComponentes} </p>
    </div>
  );
}

export default ProductosCat;
