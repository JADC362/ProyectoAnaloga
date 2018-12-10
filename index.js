//Adquisicion de librerias necesarias 
const express = require('express');
const five = require('johnny-five'); //Libreria para control de arduino
const app = express();
const {performance} = require('perf_hooks');
const server = require('http').Server(app);
const io = require('socket.io')(server); //Libreria para establecer conexion entre node y jquery

var board; //Objeto que representa la tarjeta
var LedRGB = null;
var S0 ;
var S1 ;
var sensor;
var S2 ;
var S3 ; 
var red = "ff0000";
var green = "00ff00";
var blue = "0000ff";
var startTime;
var socket;
var intervalo;

server.listen(9015); //Puerto del servidor
app.use(express.static("public")); //Permite el uso de archivos css, images, js, en el index.html

/*function tomaDatos(duration, FiltrosR, FiltrosA, FiltrosV) {
    var Filtros;
    var iColor = 0;
    var iSensor = 0;
    var LedInd = 0;

    var settings = {
          pin: 8,
          value: board.io.LOW,
          pulseOut: 5,
        };
	var i,j;

    var read = function() {
          board.io.pingRead(settings, function(microseconds) {
          	LedRGB.toggle();


          	i = iColor%3;

          	switch(i){
          		case 0:
          			Filtros = FiltrosR;
          			LedInd = 1;
          			break;
          		case 1:
          			Filtros = FiltrosA;
          			LedInd = 4;
          			break;
          		case 2:
          			Filtros = FiltrosV;
          			LedInd = 7;
          			break;
          	}


          	j = iSensor%3;

          	LedSen = parseInt(Filtros[j])*(LedInd+j);

          	switch(LedSen){
          		case 1:
          			LedRGB.color("red");
	                S2.low();
	                S3.low();
          			break;
          		case 2:
          			LedRGB.color("red");
	                S2.low();
	                S3.high();
          			break;	
          		case 3:
          			LedRGB.color("red");
	                S2.high();
	                S3.high();
          			break;
          		case 4:
          			LedRGB.color("blue");
	                S2.low();
	                S3.low();
          			break;
          		case 5:
          			LedRGB.color("blue");
	                S2.low();
	                S3.high();
          			break;	
          		case 6:
          			LedRGB.color("blue");
	                S2.high();
	                S3.high();
          			break;
          		case 7:
          			LedRGB.color("green");
	                S2.low();
	                S3.low();
          			break;
          		case 8:
          			LedRGB.color("green");
	                S2.low();
	                S3.high();
          			break;	
          		case 9:
          			LedRGB.color("green");
	                S2.high();
	                S3.high();
          			break;
          		default:
          			LedRGB.color("red");
	                S2.low();
	                S3.low();
	                LedSen = 0;
          	}
          	iSensor++;
          	if(iSensor%3==0){iColor++}
/*	        Led = (iColor % 3);
	        switch (Led) {
	            case 0:
	                LedRGB.color("red");
	                LedInd = 0;
	                break;
	            case 1:
	                LedRGB.color("blue");
	                LedInd = 3;
	                break;
	            case 2:
	                LedRGB.color("green");
	                LedInd = 6;
	                break;
	        }

	        LedS = iSensor % 3;
	        switch (LedS) {
		            case 0:
	                    S2.low();
	                    S3.low();
	                    break;
	                case 1:
	                    S2.low();
	                    S3.high();
	                    break;
	                case 2:
	                    S2.high();
	                    S3.high();
	                    break;
	        }

	       	iSensor++;
	       	if (iSensor%3==0) {
	       		iColor++;
	       	}
	       	if ((microseconds<500)) {
	       		socket.emit("DatosIntensidad",(LedSen-1).toString()+","+microseconds.toString());
	       		console.log((LedSen-1).toString()+","+microseconds.toString());
	       	}	
            if(intervalo){ setTimeout(read, duration);}
          });
        }.bind(board);

    read();
}*/

function tomaDatos(duration, Filtros) {
    var Filtros;
    var iColor = 0;
    var iSensor = 0;
    var LedInd = 0;

    var settings = {
          pin: 8,
          value: board.io.LOW,
          pulseOut: 5,
        };

    var read = function() {
          board.io.pingRead(settings, function(microseconds) {
          	LedRGB.toggle();

	        LedS = iSensor % 3;
	        switch (LedS) {
	            case 0:
                    S2.low();
                    S3.low();
                    break;
                case 1:
                    S2.low();
                    S3.high();
                    break;
                case 2:
                    S2.high();
                    S3.high();
                    break;
	        }

	        Led = iColor % 3;
	        switch (Led) {
	            case 0:
	                LedRGB.color("red");
	                LedInd = 0;
	                break;
	            case 1:
	                LedRGB.color("blue");
	                LedInd = 3;
	                break;
	            case 2:
	                LedRGB.color("green");
	                LedInd = 6;
	                break;
	        }
	       	if((microseconds<500) && Filtros[LedInd+LedS]==1){
	       		socket.emit("DatosIntensidad",(LedInd+LedS).toString()+","+microseconds.toString());
	       	}
            if(intervalo){ setTimeout(read, duration);}

	       	iSensor++;
	       	if(iSensor%3==0){iColor++;}

          });
        }.bind(board);

	read();
}

function barridoDatos(){
	var read = function() {
         board.io.pingRead(settings, function(microseconds) {
        	LedRGB.toggle();

          });
        }.bind(board);

	read();
}

//Creacion del socket y comunicacion de nodejs con jquery
io.on('connection',function(pSocket){
	socket=pSocket;
	//Escucha por peticiones de la pagina html
	socket.on('Peticion',function(msg){
		if (LedRGB==null) {
			board = new five.Board(); //Inicializa la variable board
		}

		//En caso exitoso de conexion
		board.on("connect",function(event){
			socket.emit("Peticion","Success");
		});

		//En caso de fallo de conexion
		board.on("fail",function(event){
			socket.emit("Peticion","Error: "+event.message);
		});
	});
	//Escuchar por la accion de iniciar mediciones con los colores deseados
	//Orden colores: Rojo(1), Azul(2), Verde(3)
	socket.on('IniciarMedicionDefinidas',function(msg){
		colorsensors = msg.split(",");
		try{
			board.on("ready",function(){
				//Inicializacion de objetos para los modelos de arduino
				intervalo = true;
				if(LedRGB == null){
					LedRGB= new five.Led.RGB({pins: { red:10 ,green:11,blue:9  }});
					S0 = new five.Pin({pin: 4, type: "digital"});
					S1 = new five.Pin({pin: 5, type: "digital"});
					S2 = new five.Pin({pin: 6, type: "digital"});
					S3 = new five.Pin({pin: 7, type: "digital"});
					//Establecer amplificacion de sensor a 20%
					S0.high();
					S1.low();
				}
				FiltrosR  = [colorsensors[0],colorsensors[1],colorsensors[2]];
				FiltrosA  = [colorsensors[3],colorsensors[4],colorsensors[5]];
				FiltrosV  = [colorsensors[6],colorsensors[7],colorsensors[8]];
				tomaDatos(5,colorsensors);
			});
		}
		catch(err){
			socket.emit("Peticion","Error: No connected device found");
		}
	});

	socket.on('IniciarMedicionBarrido',function(msg){
		try{
			board.on("ready",function(){
				//Inicializacion de objetos para los modelos de arduino
				if(LedRGB == null){
					LedRGB= new five.Led.RGB({pins: { red:10 ,green:11,blue:9  }});
					S0 = new five.Pin({pin: 4, type: "digital"});
					S1 = new five.Pin({pin: 5, type: "digital"});
					S2 = new five.Pin({pin: 6, type: "digital"});
					S3 = new five.Pin({pin: 7, type: "digital"});
					//Establecer amplificacion de sensor a 20%
					S0.high();
					S1.low();
				}
				barridoDatos();
			});
		}
		catch(err){
			socket.emit("Peticion","Error: No connected device found");
		}
	});

	//Escucha por la accion de detener mediciones
	socket.on('DetenerMedicion',function(msg){
		intervalo = false;
		LedRGB.off();
	});

});