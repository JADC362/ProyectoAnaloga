var colorGreen = "#00ba9f";
var colorGrayOff = "#282d3e";
var colorWhite = "#ffffff";
var socket;
var graphAR;
var graphAA;
var graphAV;
var startTime = 0;
var factor;

var matrizDataAbs = [];
var matrizDataCon = [];
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
	matrizDataAbs = [];
	matrizDataCon = [];
	for (var i = 0; i < 9; i++) {
		matrizDataAbs.push(new Array())
		matrizDataCon.push(new Array())
	}
	matrizDataAbs[0].push({x:0,y:0});
	matrizDataAbs[1].push({x:0,y:0});
	matrizDataAbs[2].push({x:0,y:0});
	matrizDataAbs[3].push({x:0,y:0});
	matrizDataAbs[4].push({x:0,y:0});
	matrizDataAbs[5].push({x:0,y:0});
	matrizDataAbs[6].push({x:0,y:0});
	matrizDataAbs[7].push({x:0,y:0});
	matrizDataAbs[8].push({x:0,y:0});

	matrizDataCon[0].push({x:0,y:0});
	matrizDataCon[1].push({x:0,y:0});
	matrizDataCon[2].push({x:0,y:0});
	matrizDataCon[3].push({x:0,y:0});
	matrizDataCon[4].push({x:0,y:0});
	matrizDataCon[5].push({x:0,y:0});
	matrizDataCon[6].push({x:0,y:0});
	matrizDataCon[7].push({x:0,y:0});
	matrizDataCon[8].push({x:0,y:0});

	socket.on('DatosIntensidad',function(msg){

		var partesMsg = msg.split(",")
		if (startTime == 0) {
			startTime = Date.now();
		}
		var millis = Date.now()-startTime;
		if(parseInt(partesMsg[0])!=-1){
				matrizDataAbs[parseInt(partesMsg[0])].push({x:millis/1000,y:parseFloat(partesMsg[1])});
				matrizDataCon[parseInt(partesMsg[0])].push({x:factor[parseInt(partesMsg[0])]*parseFloat(partesMsg[1]),y:parseFloat(partesMsg[1])});
		}
		graficarDatosAbsMedicionAbs();
		graficarDatosAbsMedicionCon();
});}

function graficarDatosAbsMedicionAbs(){
	
	graphAR = new GraphK("#AbsorbanciaRojo");

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

	graphAA = new GraphK("#AbsorbanciaAzul");

	var graphDataAR = new GraphDataK("Sensor Rojo",matrizDataAbs[3]);
	graphDataAR.setType("line");
	graphDataAR.setWidth(10);
	graphDataAR.setStrokeStyle("#ff0000");

	var graphDataAA = new GraphDataK("Sensor Azul",matrizDataAbs[4]);
	graphDataAA.setType("line");
	graphDataAA.setWidth(10);
	graphDataAA.setStrokeStyle("#0000ff");

	var graphDataAV = new GraphDataK("Sensor Verde",matrizDataAbs[5]);
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

	graphAV = new GraphK("#AbsorbanciaVerde");

	var graphDataVR = new GraphDataK("Sensor Rojo",matrizDataAbs[6]);
	graphDataVR.setType("line");
	graphDataVR.setWidth(10);
	graphDataVR.setStrokeStyle("#ff0000");

	var graphDataVA = new GraphDataK("Sensor Azul",matrizDataAbs[7]);
	graphDataVA.setType("line");
	graphDataVA.setWidth(10);
	graphDataVA.setStrokeStyle("#0000ff");

	var graphDataVV = new GraphDataK("Sensor Verde",matrizDataAbs[8]);
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
	graphAV.rendering();
}


function graficarDatosAbsMedicionCon(){
	
	graphAR = new GraphK("#ConcentracionRojo");

	var graphDataRR = new GraphDataK("Sensor Rojo",matrizDataCon[0]);
	graphDataRR.setType("line");
	graphDataRR.setWidth(10);
	graphDataRR.setStrokeStyle("#ff0000");

	var graphDataRA = new GraphDataK("Sensor Azul",matrizDataCon[1]);
	graphDataRA.setType("line");
	graphDataRA.setWidth(10);
	graphDataRA.setStrokeStyle("#0000ff");

	var graphDataRV = new GraphDataK("Sensor Verde",matrizDataCon[2]);
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

	graphAA = new GraphK("#ConcentracionAzul");

	var graphDataAR = new GraphDataK("Sensor Rojo",matrizDataCon[3]);
	graphDataAR.setType("line");
	graphDataAR.setWidth(10);
	graphDataAR.setStrokeStyle("#ff0000");

	var graphDataAA = new GraphDataK("Sensor Azul",matrizDataCon[4]);
	graphDataAA.setType("line");
	graphDataAA.setWidth(10);
	graphDataAA.setStrokeStyle("#0000ff");

	var graphDataAV = new GraphDataK("Sensor Verde",matrizDataCon[5]);
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

	graphAV = new GraphK("#ConcentracionVerde");

	var graphDataVR = new GraphDataK("Sensor Rojo",matrizDataCon[6]);
	graphDataVR.setType("line");
	graphDataVR.setWidth(10);
	graphDataVR.setStrokeStyle("#ff0000");

	var graphDataVA = new GraphDataK("Sensor Azul",matrizDataCon[7]);
	graphDataVA.setType("line");
	graphDataVA.setWidth(10);
	graphDataVA.setStrokeStyle("#0000ff");

	var graphDataVV = new GraphDataK("Sensor Verde",matrizDataCon[8]);
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
	graphAV.rendering();
}

function makeTextFile(filename, data) {
	var blob = new Blob([data], {type: 'text/textplain'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

//Funcion general del codigo
function init(){
    socket = io();
	$(".controlLedList li").click(function(){
		if ($(this).children(".generalGraphsListIndicador").data("state")==0) {
			var color = $(this).children(".generalGraphsListIndicador").data("color");
			$(this).children(".generalGraphsListIndicador").data("state",1)
			$(this).children(".generalGraphsListIndicador").animate({
				backgroundColor: color,
				borderColor: color
			},600);
		}
		else{
			var colorBack = "#f8f8fb";
			var colorBorder = "#A6B7CF";
			$(this).children(".generalGraphsListIndicador").data("state",0)
			$(this).children(".generalGraphsListIndicador").animate({
				backgroundColor: colorBack,
				borderColor: colorBorder
			},600);
		}
		
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
					socket.emit("IniciarMedicionDefinidas",$("#colorSensor11").data("state")+","+$("#colorSensor12").data("state")+","+$("#colorSensor13").data("state")+","+$("#colorSensor21").data("state")+","+$("#colorSensor22").data("state")+","+$("#colorSensor23").data("state")+","+$("#colorSensor31").data("state")+","+$("#colorSensor32").data("state")+","+$("#colorSensor33").data("state"));
					factor = [];
					factor.push($("#boxConcentracionRojo").attr("value"));
					factor.push($("#boxConcentracionRojo").attr("value"));
					factor.push($("#boxConcentracionRojo").attr("value"));

					factor.push($("#boxConcentracionAzul").attr("value"));
					factor.push($("#boxConcentracionAzul").attr("value"));
					factor.push($("#boxConcentracionAzul").attr("value"));

					factor.push($("#boxConcentracionVerde").attr("value"));
					factor.push($("#boxConcentracionVerde").attr("value"));
					factor.push($("#boxConcentracionVerde").attr("value"));
					console.log(factor);
					adquirirDatosMedicion();
				}
				else{
					alert("Verificar condiciones");
				}
			},500);
		}
		else{
			alert("Seleccione algun sensor para medir.")
		}
		
	});

	$(".controlLedImage").click(function(){

		var csvRed = "Sensor,Tiempo,Concentracion,Intensidad";

		for (var i = 0;i < 3;i++) {
			switch(i){
				case 0:
					Label = "Rojo";
					break;
				case 1:
					Label = "Azul";
					break;
				case 2:
					Label = "Verde";
					break;
			}
			for (var j = 1;j<matrizDataAbs[i].length;j++){
				valorX = (matrizDataAbs[i][j]).x;
				valorY = (matrizDataAbs[i][j]).y;
				valorCon = (matrizDataCon[i][j]).x;
				csvRed+="\n";
				csvRed+=(Label+","+valorX+","+valorCon+","+valorY);
			}					
		}

		var csvBlue = "Sensor,Tiempo,Valor";
		for (var i = 3;i < 6;i++) {
			switch(i){
				case 3:
					Label = "Rojo";
					break;
				case 4:
					Label = "Azul";
					break;
				case 5:
					Label = "Verde";
					break;
			}
			for (var j = 1;j<matrizDataAbs[i].length;j++){
				valorX = (matrizDataAbs[i][j]).x;
				valorY = (matrizDataAbs[i][j]).y;
				csvBlue+="\n";
				csvBlue+=(Label+","+valorX+","+valorY);
			}					
		}

		var csvGreen = "Sensor,Tiempo,Valor";
		for (var i = 6;i < 9;i++) {
			switch(i){
				case 6:
					Label = "Rojo";
					break;
				case 7:
					Label = "Azul";
					break;
				case 8:
					Label = "Verde";
					break;
			}
			for (var j = 1;j<matrizDataAbs[i].length;j++){
				valorX = (matrizDataAbs[i][j]).x;
				valorY = (matrizDataAbs[i][j]).y;
				csvGreen+="\n";
				csvGreen+=(Label+","+valorX+","+valorY);
			}					
		}

		switch($(this).attr("id")){
			case "controlLedImageRed":
				makeTextFile("DatosRojo.txt",csvRed);
				break;
			case "controlLedImageBlue":
				makeTextFile("DatosAzul.txt",csvBlue);
				break;
			case "controlLedImageGreen":
				makeTextFile("DatosVerde.txt",csvGreen);
				break;
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



