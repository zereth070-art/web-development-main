//#region ---------------------- MODULO PRINCIPAL DE ENTRADA a NODEJS --------------------
/*
express funciona mediante una secuenciacion de modulos middleware (en nodejs son funciones js)
que se ejecuta en orden de declaracion:

pet.cliente ------> funct.middle-(req,res,next) ----> funct.middle-2(req,res,next)---------->,...----->
func.middle-final(req,res)                                            ||
                                                                      ||
                                                              en req objeto HTTP REQUEST          en req objeto HTTP-REQUEST modificado por middle-1
                                                              del cliente(la puede modificar)     en res objeto HTTP-RESPONSE
                                                              en res objeto HTTP-RESPONSE       <------------------------
                                                      <-----------------------
  para configurar el pipeline de express se emplean metodos de la clase Application de express, como por ejemplo:
  .use( ['/ruta',] function(req, res, next){....} ) ----> registra una funcion middleware q se ejecuta para todas las peticiones q haran
                                                          los clientes SI NO SE ESPEFICICA LA RUTA
  .get( ['/ruta',] function(req, res, next){....} ) -----> registra una funcion middleware q se ejecuta para todas las peticiones GET
  .post( ['/ruta',] function(req, res, next){....} ) -----> registra una funcion middleware q se ejecuta para todas las peticiones post
  .put( ['/ruta',] function(req, res, next){....} ) -----> registra una funcion middleware q se ejecuta para todas las peticiones put
  .delete( ['/ruta',] function(req, res, next){....} ) -----> registra una funcion middleware q se ejecuta para todas las peticiones delete
  .patch( ['/ruta',] function(req, res, next){....} ) -----> registra una funcion middleware q se ejecuta para todas las peticiones patch

  REGLAS CONFIG PIPELINES EXPRESS
  --------------------------------------------
  -poner las funciones middleware que se ejecutan para todas las rutas al principio de la ocnfiguarion
  (pq suelen modificar el objeto 'req' del cliente y le añaden propiedades q luego pueden ser usadasd por las demas funciones
  middleware) NUNCA GENERAN RESPUESTA
  - poner las funciones middleware que se ejecutan para rutas espeficicas al final de la configuarion, espeficicando el metodo HTTP
  por el cual se accede a la ruta (get, post, etc). Estas funciones SI GENERAN RESPUESTA
*/
//#endregion

//mete en una variable lo q devuelve required, que es como un import
const express = require("express"); /* el modulo express exporta una funcion que asignamos a variable "express",
que al ejecutarla nos devuelve un objeto Application de Express
que es un servidor web que podemos configurar y ejecutar para atender peticiones HTTP en un determinado puerto
para lo cual se usa el metodo .listen()
*/
const cookieParser= require('cookie-parser');

const app = express();
const port = 3000;
app.use(function (req, res, next) {
  console.log(`Peticion entrante: ${req.method} ${req.url}`);
  res
    .status(200)
    .send(
      "Hola cliente... he recibido tu peticion y te devuelvo esta respuesta dese el servidor web en nodejs",
    );
});
app.use(express.json()); //<-------- primera funcion middleware, lo que hace es que meter
                        //en prop. req.body del objeto HTTP-REQUEST del cliente, los datos
                        // del cuerpo de la peticion HTTP si es un JSON valido,
                        // para que luego pueda ser usado por los demas middlewares

app.use(express.urlencoded({extended:true})); //<---- 2º funcion middleware, exrae las variables del qureystring de la URL

app.use(cookieParser() ); //<---- 3º funcion middleware, extrae las cookies de la cabecera Cookie de la cabecera Cookies del HTTP-REQUEST del cliente crea un objeto JS: {nombreCOokie: valor, ... } y lo mete en prop. 'req.cookies'

app.use("/api/Tienda/Categorias", function (req, res, next) {
console.log(`Peticion entrante: ${req.method} ${req.url}`);
  res
    .status(200)
    .send(
      "Hola cliente... he recibido tu peticion y te devuelvo esta respuesta dese el servidor web en nodejs",
    );
});

app.get("/", (req, res) => {
  res.send(
    "Hola cliente... he recibido tu peticion y te devuelvo esta respuesta dese el servidor web en nodejs!",
  );
});

app.listen(port, (error) => {
  if (error) {
    console.log("vaya cagada");
  }
  console.log(`Ejemplo de un servidor con el puerto:  ${port}`); //funtion exception de error
});
