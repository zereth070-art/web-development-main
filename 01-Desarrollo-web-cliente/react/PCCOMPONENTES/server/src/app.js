//#region -------------------- MODULO PRINCIPAL DE ENTRADA a NODEJS ------------------------
/*
    express funciona mediatne la secuenciacion de una serie de modulos middleware (en nodejs son funciones JS)
    que se ejecutan en orden de declaracion:

                        |-------------------- pipeline o middleware-stack --------------------- .......
    pet.cliente ---->  func.middle-1(req,res,next) -- next() --> func.middle-2(req,res,next) -- next() --> func.middle-3(req,res,next) ---> ... ---> func.middle-n(req,res,next) ---> res.send() ----> pet.cliente
                            ||                                          ||
                        en "req" objeto HTTP-REQUEST        en "req" objeto HTTP-REQUEST modif por middle-1
                        del cliente(la puede modificar)     en "res" objeto HTTP-RESPONSE
                        en "res" objeto HTTP-RESPONSE                   |
                 <-----------|                                          |
                 <-------------------------------------------------------

      para configurar el pipeline de express se emplean metodos de la clase Application de express, como por ejemplo:
        .use( ['/ruta',] function(req,res,next){....} ) ----> registra una funcion middleware q se ejecuta para todas las peticiones q hagan
                                                            los clientes SINO SE ESPECIFICA UNA RUTA
        .get( '/ruta', function(req,res,next){....} ) ----> registra una funcion middleware q se ejecuta para todas las peticiones GET
                                                            q hagan los clientes a la ruta especificada
        .post( '/ruta', function(req,res,next){....} ) ----> registra una funcion middleware q se ejecuta para todas las peticiones POST
                                                            q hagan los clientes a la ruta especificada
        (igual para .put(), .delete(), .patch(), etc)
        ....

        REGLAS CONFIG PIPELINE EXPRESS
        ------------------------------
        - poner las funciones middleware que se ejecutan para todas las rutas al principio de la configuracion
        (pq suelen modificar el objeto "req" del cliente y le añaden propiedades q luego pueden ser usadas por las demas funciones
        middleware) NUNCA GENERAN RESPUESTA

        - poner las funciones middleware que se ejecutan para rutas especificas al final de la configuracion, especificando el metodo HTTP
        por el cual se accede a la ruta (get, post, etc). Estas funciones SI GENERAN RESPUESTA

    */
//#endregion
require("dotenv").config(); //<--- la funcion .config() lee el fichero .env y mete en objeto "process.env" las variables
//definidas como variables de entorno del sistema operativo, para que puedan ser usadas en cualquier
// parte del codigo de nodejs

const mongodb = require("mongodb"); //<--- el modulo "mongodb" exporta un objeto que asignamos a variable "mongodb", q expone props.
// como MongoClient q sirve para crear el cliente conexion
const clienteConexionMongoDB = new mongodb.MongoClient(process.env.MONGODB_URL); //<--- en atlas la cadena conexion varia: mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net

const express = require("express"); //<--- el modulo "express" exporta una funcion que asignamos a variable "express",
//que al ejecutarla nos devuelve un objeto Application de Express: https://expressjs.com/en/5x/api/application/
//q es un servidor web que podemos configurar y ejecutar para atender peticiones HTTP en un determinado puerto
//para lo cual se usa el metodo .listen()
const cookieParser = require("cookie-parser"); //<--- el modulo "cookie-parser" exporta una funcion que asignamos a variable "cookieParser",
const cors = require("cors"); //<--- el modulo "cors" exporta una funcion que asignamos a variable "cors",
const jsonwebtoken = require("jsonwebtoken"); //<--- modulo para crear JWT de sesion de usuario
const bcrypt = require("bcrypt"); //<--- modulo para hashear y comprobar hashes de passwords de usuarios

const webServer = express();

//------------------------------------ CONFIG PIPELINE: miiddleware-stack de express ---------------------------------------------
// webServer.use(
//     function(req,res,next){
//         console.log(`Peticion entrante: ${req.method} ${req.url}`);
//         //res.status(200).send('Hola cliente....he recibido tu peticion y te devuelvo esta respuesta desde el servidor web en nodejs');
//         next(); //<--- invoca al siguiente middleware en la cadena de ejecucion
//     }
// )
webServer.use(express.json()); //<---- 1º funcion middleware, lo que hace es meter en prop. "req.body" del objeto HTTP-REQUEST
//del cliente, los datos del cuerpo de la peticion HTTP si es un JSON valido, para que luego pueda ser
//  usado por los demas middlewares
webServer.use(express.urlencoded({ extended: true })); //<---- 2º funcion middleware, extrae las variables del querystring de la URL
//crea un objeto JS: {variable_Query: valor, ...} y lo mete en prop. "req.query"

webServer.use(cookieParser()); //<---- 3º funcion middleware, extrae las cookies de la cabecera Cookies del HTTP-REQUEST del cliente
//crea un objeto JS: {nombreCookie: valor, ...} y lo mete en prop. "req.cookies"

webServer.use(cors()); //<---- 4º funcion middleware, habilita CORS

webServer.get("/api/Tienda/Categorias", async function (req, res, next) {
  try {
    console.log(`Peticion entrante: ${req.method} ${req.url}`);
    //1º paso: conectarme a la BD, usando un cliente de conexion a MongoDB: mongodb<--- driver nativo para nodejs de mongodb
    await clienteConexionMongoDB.connect();
    //2º paso: ejecutar la consulta a la BD de Mongodb para recuperar las categorias de productos(en un principio
    //solo quiero las principales o raices, es decir, las q no tienen padre por encima)
    // <--- query: db['PcComponentes'].categorias.find( { tipo:'...' } )
    // <==== resultado: array de objetos a devolver al cliente en variable _categorias
    let _queryRegExp = /^\d+$/;
    let __categorias = await clienteConexionMongoDB
      .db(process.env.MONGODB_DBNAME)
      .collection("categorias")
      .find({ pathCat: { $regex: _queryRegExp } })
      .toArray();
    //3º paso: devolver la respuesta al cliente con el resultado de la operacion contra la BD
    console.log("Categorias recuperadas de la BD: ", __categorias);

    res.status(200).send({
      codigo: 0, //<----- codigo de resultado de la operacion contra la bd, si es 0=ok, en caso contrario sera un error
      mensaje: "categorias recuperadas correctametne",
      categorias: __categorias,
    });
  } catch (error) {
    console.log(`Error al recuperar categorias de la BD: ${error}`);
    res
      .status(200)
      .send({
        codigo: 1,
        mensaje: `Error al recuperar categorias de la BD: ${error}`,
        categorias: [],
      });
  }
});

webServer.post("/api/Cliente/Login", async function (req, res, next) {
  try {
    //en req.body la funcion middleware express.json() ha metido el objeto { email: '....', password: '...'}
    //para procesarlo en este endpoint
    //1º paso: conectarme a la bd y comprobar si existe un usuario con ese email....
    //         SI NO --> error no existe usuario con ese email
    //2º paso: si existe, comprobar si el hash q tiene almacenado coincide con el hash
    //         de la password q me ha enviado ... SI NO ---> error de password incorrecta
    if (!bcrypt.compareSync(password, _usuario.cuenta.password)) throw new Error('Password incorrecta');
    //3º paso: crear JWT con los datos del usuario que me interesen preservar en la sesion y
    //         enviarselo al cliente (se podria usar una cookie, lo hacemos sin ellas)
    const token = jsonwebtoken.sign(
      {
        email; _usuario.cuenta.email, nombre: _usuario.nombre, _id: _usuario._id
        process.env.JSW_SECRET,
        {expiresIn: '1h'} // <--------- el token expira en 1 hora, hay que comprobar su caducidad en cada peticion del cliente
      }
    );
    //4º paso: devolver al cliente un objeto JSON con el resultado de la operacion
  } catch (error) {
    console.log(`Error al procesar login de cliente: ${error}`);
    res
      .status(200)
      .send({
        codigo: 1,
        mensaje: `Error al procesar login de cliente: ${error}`,
        token: "",
      });
  }
});

//------------------------------------ FIN CONFIG PIPELINE: miiddleware-stack de express ---------------------------------------------
webServer.listen(
  3000, //<--- puerto de escucha del servidor web, en nodejs suele ser 3000
  (error) => {
    if (error) {
      console.log(`Error al iniciar el servidor: ${error}`);
    } else {
      console.log(
        `----- Servidor web iniciado en http://localhost:3000 ------`,
      );
    }
  },
);
