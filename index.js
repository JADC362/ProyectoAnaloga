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
var Sensor;
var S2 ;
var S3 ; 
var red = "ff0000";
var green = "00ff00";
var blue = "0000ff";
var startTime;
var socket;
var iColor = 0;
var intervalo;
var intensidad = 0;

server.listen(9015); //Puerto del servidor
app.use(express.static("public")); //Permite el uso de archivos css, images, js, en el index.html

function tomaDatos(duration, FiltrosR, FiltrosA, FiltrosV) {
    var Filtros;
    iColor = 0;
    S2.low();
    S3.high();
    LedRGB.color("blue");
    LedRGB.on();

    var millis = [];
    var samples = []
    samples.push(0);
    millis.push(performance.now());
	setInterval(function(){
		Sensor.io["digitalRead"](8,function(data){
			if (samples[samples.length-1]!=data) {
				console.log(data)
				samples.push(data);
				millis.push(performance.now());
				//console.log((millis[millis.length-1]-millis[millis.length-2]));
			}
	}.bind(Sensor));
    },1);
    
    /*Sensor.on("change",function(){
    	millis.push(Date.now());
        //millis.push(Date.now() - millis[millis.length-1]);
        //console.log(millis[millis.length-1]);
        console.log(millis[millis.length-1]-millis[millis.length-2]);
    });*/

    /*intervalo = setInterval(function() {
        LedRGB.toggle();
        Led = iColor % 3;
        switch (Led) {
            case 0:
                LedRGB.color("red");
                LedInd = 0;
                Filtros = FiltrosR;
                break;
            case 1:
                LedRGB.color("blue");
                LedInd = 3;
                Filtros = FiltrosA;
                break;
            case 2:
                LedRGB.color("green");
                LedInd = 6;
                Filtros = FiltrosV;
                break;
        }
       	//iColor++;
        var millis = [];
       	startTime = Date.now();
       	millis.push(startTime);
        Sensor.on("change",function(){
        	millis.push(Date.now() - millis[millis.length-1]);
        	console.log(millis[millis.length-1]);
        });
        // Setting red filtered photodiodes to be read
        /*for (var i = 0; i < 3; i++) {
            switch (i) {
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
       		startTime = Date.now();
       		millis.push(startTime);
            for (var j = 0; j < 20 * parseInt(Filtros[i]); j++) {
            	
                // Reading the output frequency
            	Sensor.on("change",function(){
        			millis.push(Date.now() - millis[millis.length-1]);
        			//console.log(j+","+millis[millis.length-1]);
            	});
                //console.log((i + LedInd).toString() + "," + intensidad.toString());
                //socket.emit("DatosIntensidad", (i + LedInd).toString() + "," + intensidad.toString());
                
            }
        }

    }.bind(LedRGB), duration || 100);*/
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
	socket.on('IniciarMedicion',function(msg){
		colorSensors = msg.split(",");
		try{
			board.on("ready",function(){
				//Inicializacion de objetos para los modelos de arduino
				if(LedRGB == null){
					LedRGB= new five.Led.RGB({pins: { red:10 ,green:11,blue:9  }});
					S0 = new five.Pin({pin: 4, type: "digital"});
					S1 = new five.Pin({pin: 3, type: "digital"});
					S2 = new five.Pin({pin: 6, type: "digital"});
					S3 = new five.Pin({pin: 7, type: "digital"});
					Sensor = new five.Sensor({
						pin: 8,
						threshold: 1,
						type: "digital",
						freq: 1
					});
					/*settings = {
			          pin: 5,
			          value: Sensor.io.HIGH
			        };
			        sensorPing = new five.Ping({pin:5});*/
			       	/*proximity = new five.Proximity({
			        	pin: 5,
			        	controller: "HCSR04"
			        });*/
				}
				FiltrosR  = [colorSensors[0],colorSensors[1],colorSensors[2]];
				FiltrosA  = [colorSensors[3],colorSensors[4],colorSensors[5]];
				FiltrosV  = [colorSensors[6],colorSensors[7],colorSensors[8]];
				tomaDatos(200,FiltrosR,FiltrosA,FiltrosV);
			});
		}
		catch(err){
			socket.emit("Peticion","Error: No connected device found");
		}
		
	});

	//Escucha por la accion de detener mediciones
	socket.on('DetenerMedicion',function(msg){
		clearInterval(intervalo);
		LedRGB.off();
	});

});