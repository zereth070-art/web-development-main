cliente react ----------------------------------------------------------> servidor Nodejs express
  ||										pipeline
componente LoginRegistro.jsx						express.json() ---- next() --->    express.urlencoded() -- next()-->
en botón "Iniciar Sesión"						     ||					||
fetch('
http://localhost:3000/api/Cliente/Login
',			¿req tiene datos en el body josn?   ¿req en la url tiene variables querystring?
	{ method: POST, body: {email: ....., password: ...} })		si, req.body={email:.., password:..}	si, req.query={ s: true}
										next()				   next()




el servidor en su servicio api-rest cuando  comprueba creds. necesita mandar algo al cliente para q en operaciones futuras
q realice recuerde q ya ha estado y se ha logueado bien(autentificado ok)===> generar ESTADO DE SESION
Hay varias formas:

	- el sevidor genera un id-sesión random (asociado a un _id de cliente en mongodb) y lo manda en una cookie al
	cliente <=== valores en cookies cifrados o hasheados por clave del server por seguridad para evitar manipulación

	- JWT (Json Web Tokens): un objeto json con valores q el servidor quiere q almacene el cliente, firmado directamente
	por clave del servidor y hasheado después, además es temporal (caduca).
	en cliente:Te tienes q asegurar que el cliente te mande siempre el JWT cada vez que quiera hacer una operación en el servidor.
	en servidor: asegurar q la firma es correcta y no esta caducado


	- sesión usando autentificación de terceros (oAuth2), p.e Google, Facebook, Discord, ...

21:08


HACER ENPTOINT REGISTRO
1ER PASO, COMPROBAR QUE EMAIL NO ESTE REGISTRADO YA

2DO PASO, SI NO EXISTE, HASHEAR LA PASSOWRD CON BCRYPT Y ALMACENAR DATOS DE COLECCION CLIENTES DE LA DB

3 generar un jwt de uso unico (caducidad muy breve) y mandarlo por email apara que confirme su registro.


4º PASO, GENERAR RESPUESTA AL CLIENTE CON EL RESULTADO DE LA OPERACION REGISTRO. INSERT.
