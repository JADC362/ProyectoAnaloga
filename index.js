//Adquisicion de librerias necesarias 
const express = require('express');
const five = require('johnny-five'); //Libreria para control de arduino
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server); //Libreria para establecer conexion entre node y jquery

var board; //Objeto que representa la tarjeta
server.listen(9007); //Puerto del servidor
app.use(express.static("public")); //Permite el uso de archivos css, images, js, en el index.html

//Creacion del socket y comunicacion de nodejs con jquery
io.on('connection',function(socket){

	//Escucha por peticiones de la pagina html
	socket.on('Peticion',function(msg){
		switch (msg){
			case "ControlConexionArduino": 
				board = new five.Board(); //Inicializa la variable board

				//En caso exitoso de conexion
				board.on("connect",function(event){
					socket.emit("Peticion","Success");
				});

				//En caso de fallo de conexion
				board.on("fail",function(event){
					socket.emit("Peticion","Error: "+event.message);
				});
				break;
			case "ControlFlujoSistema":
				try{
					board.on("ready",function(){
						//Inicializacion de objetos para los modelos de arduino
						var modulosFuncionando = true;

						socket.emit("Peticion","Success");
					});
				}
				catch(err){
					socket.emit("Peticion","Error: No connected device found");
				}
				
				break;
		default:
			console.log("Error?");
		}
	});
	//Escuchar por la accion de iniciar mediciones con los colores deseados
	//Orden colores: Rojo(1), Azul(2), Verde(3)
	socket.on('IniciarMedicion',function(msg){
		colorSensors = msg.split(",");
	});

});