var colorGreen = "#00ba9f";
var colorGrayOff = "#282d3e";
var colorWhite = "#ffffff";
var socket;

var matrizDataAbs = [];
//Inicio de javascript si el documento ya esta cargado
$( document ).ready(function() {
    init();
});

//Realiza una peticion a node para verificar los modulos y el flujo en arduino
function controlsGeneralPanel(thisObj){
	socket.emit("Peticion","ControlConexionArduino");
	socket.on("Peticion",function(msg){
		if (msg=="Success") {
			thisObj.children(".dashboardControlButtons").animate({
				backgroundColor: colorGreen
			},1000);
			thisObj.children(".dashboardControlButtons").css("color",colorWhite);
			thisObj.data("state",1);
		}
		else{
			alert(msg);
		}
	});
}

function adquirirDatosMedicion(){
	var startTime = Date.now();
	matrizDataAbs = [];
	for (var i = 0; i < 9; i++) {
		matrizDataAbs.push(new Array())
	}
	socket.on('DatosIntensidad',function(msg){
		var partesMsg = msg.split(",")
		var millis = Date.now()-startTime;
		matrizDataAbs[parseInt(partesMsg[0])].push({x:millis,y:parseFloat(partesMsg[1])})
	});
}

function graficarDatosAbsMedicion(){

	var graphAR = new GraphK("#AbsorbanciaRojo");

	var graphDataRR = new GraphDataK("Sensor Rojo",matrizDataAbs[0]);
	graphDataRR.setType("line");
	graphDataRR.setWidth(10);
	graphDataRR.setStrokeStyle("#ff0000");

	var graphDataRA = new GraphDataK("Sensor Azul",matrizDataAbs[1]);
	graphDataRA.setType("line");
	graphDataRA.setWidth(10);
	graphDataRA.setStrokeStyle("#0000ff");

	var graphDataRV = new GraphDataK("Sensor Verde",matrizDataAbs[2]);
	graphDataRV.setType("line");
	graphDataRV.setWidth(10);
	graphDataRV.setStrokeStyle("#00ff00");

	var graphDataSetR = new GraphDataKSet();
	graphDataSetR.push(graphDataRR)
	graphDataSetR.push(graphDataRA)
	graphDataSetR.push(graphDataRV)

	graphAR.setData(graphDataSetR);
	graphAR.chartDataVisible = false;
	graphAR.chartAxisScaleVisible = false;
	graphAR.contentTitle = "";
	graphAR.rendering();

	var graphAA = new GraphK("#AbsorbanciaAzul");

	var graphDataAR = new GraphDataK("Sensor Rojo",matrizDataAbs[4]);
	graphDataAR.setType("line");
	graphDataAR.setWidth(10);
	graphDataAR.setStrokeStyle("#ff0000");

	var graphDataAA = new GraphDataK("Sensor Azul",matrizDataAbs[5]);
	graphDataAA.setType("line");
	graphDataAA.setWidth(10);
	graphDataAA.setStrokeStyle("#0000ff");

	var graphDataAV = new GraphDataK("Sensor Verde",matrizDataAbs[6]);
	graphDataAV.setType("line");
	graphDataAV.setWidth(10);
	graphDataAV.setStrokeStyle("#00ff00");

	var graphDataSetA = new GraphDataKSet();
	graphDataSetA.push(graphDataAR)
	graphDataSetA.push(graphDataAA)
	graphDataSetA.push(graphDataAV)

	graphAA.setData(graphDataSetA);
	graphAA.chartDataVisible = false;
	graphAA.chartAxisScaleVisible = false;
	graphAA.contentTitle = "";
	graphAA.rendering();

	var graphAV = new GraphK("#AbsorbanciaVerde");

	var graphDataVR = new GraphDataK("Sensor Rojo",matrizDataAbs[7]);
	graphDataVR.setType("line");
	graphDataVR.setWidth(10);
	graphDataVR.setStrokeStyle("#ff0000");

	var graphDataVA = new GraphDataK("Sensor Azul",matrizDataAbs[8]);
	graphDataVA.setType("line");
	graphDataVA.setWidth(10);
	graphDataVA.setStrokeStyle("#0000ff");

	var graphDataVV = new GraphDataK("Sensor Verde",matrizDataAbs[9]);
	graphDataVV.setType("line");
	graphDataVV.setWidth(10);
	graphDataVV.setStrokeStyle("#00ff00");

	var graphDataSetV = new GraphDataKSet();
	graphDataSetV.push(graphDataVR)
	graphDataSetV.push(graphDataVA)
	graphDataSetV.push(graphDataVV)

	graphAV.setData(graphDataSetV);
	graphAV.chartDataVisible = false;
	graphAV.chartAxisScaleVisible = false;
	graphAV.contentTitle = "";
	graphAV.contentXTitle = "Tiempo";
	graphAV.rendering();
}

//Funcion general del codigo
function init(){
    socket = io();
	$(".controlLedList li").click(function(){
		var color = $(this).children(".generalGraphsListIndicador").data("color");
		$(this).children(".generalGraphsListIndicador").data("state",1)
		$(this).children(".generalGraphsListIndicador").animate({
			backgroundColor: color,
			borderColor: color
		},600);
	});
	$("#dashboardControlSwithOn").click(function(){
		//Condicion 1
		var sensorSeleccionado = false;
		for(var i = 1;i<=3;i++){
			for (var j = 1;j<=3;j++){
				if ($("#colorSensor"+i.toString()+j.toString()).data("state")==1) {
					sensorSeleccionado=true;
				}
			}
		}
		if(sensorSeleccionado){
			$("#ControlSensorsSelected").data("state",1);
			$("#ControlSensorsSelected").children(".dashboardControlButtons").animate({
				backgroundColor: colorGreen
			},1000);
			$("#ControlSensorsSelected").children(".dashboardControlButtons").css("color",colorWhite);
			controlsGeneralPanel($("#ControlConexionArduino")); //Condicion 2

			//Si se cumplen las dos condiciones, se ejecuta la medicion
			setTimeout(function(){
				if ($("#ControlSensorsSelected").data("state")==1 && $("#ControlConexionArduino").data("state")==1){
					//Orden colores: Rojo(1), Azul(2), Verde(3)
					$("#dashboardControlSwithR").animate({
						left: '50%'
					},500);

					$("#dashboardControlSwithOff").animate({
						opacity: 0.5,
					},500);

					$("#dashboardControlSwithOn").animate({
						opacity: 1
					},500);

					$("#dashboardControlSwithOn").css("cursor","default");
					$("#dashboardControlSwithOff").css("cursor","pointer");

					//Emicion de la acciones iniciarMedicion, con los sensores a utilizar
					socket.emit("IniciarMedicion",$("#colorSensor11").data("state")+","+$("#colorSensor12").data("state")+","+$("#colorSensor13").data("state")+","+$("#colorSensor21").data("state")+","+$("#colorSensor22").data("state")+","+$("#colorSensor23").data("state")+","+$("#colorSensor31").data("state")+","+$("#colorSensor32").data("state")+","+$("#colorSensor33").data("state"));
					adquirirDatosMedicion();
					graficarDatosAbsMedicion();
				}
				else{
					alert("Verificar condiciones");
				}
			},500);s
		}
		else{
			alert("Seleccione algun sensor para medir.")
		}
		
	});

	$("#dashboardControlSwithOff").click(function(){
		$("#dashboardControlSwithOff").animate({
			opacity: 1,
		},500);
		$("#dashboardControlSwithOn").animate({
			opacity: 0.5
		},500);
		$("#dashboardControlSwithR").animate({
				left: '0%'
		},500);

		$("#dashboardControlSwithOn").css('cursor','pointer');
		$("#dashboardControlSwithOff").css('cursor','default');

		//Emicion de la acciones detenerMedicion, con los sensores a utilizar
		socket.emit("DetenerMedicion","Detener");
			
	});
}



