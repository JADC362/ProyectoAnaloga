var colorGreen = "#00ba9f";
var colorGrayOff = "#282d3e";
var colorWhite = "#ffffff";
var socket;
//Inicio de javascript si el documento ya esta cargado
$( document ).ready(function() {
    init();
});

//Realiza una peticion a node para verificar los modulos y el flujo en arduino
function controlsGeneralPanel(thisObj){
	switch (thisObj.attr("id")){
		case "ControlConexionArduino": 
			socket.emit("Peticion","ControlConexionArduino");
			break;
		case "ControlFlujoSistema":
			socket.emit("Peticion","ControlFlujoSistema");
			break;
		default:
			console.log("Error?");
	}
	socket.on("Peticion",function(msg){
		if (msg=="Success") {
			thisObj.children(".dashboardControlButtons").animate({
				backgroundColor: colorGreen
			},1000);
			thisObj.children(".dashboardControlButtons").css("color",colorWhite);
		}
		else{
			alert(msg);
		}
	});
}

//Funcion general del codigo
function init(){
    socket = io();
	$("#ControlConexionArduino").click(function(){
		controlsGeneralPanel($(this));
	});
	$("#ControlFlujoSistema").click(function(){
		controlsGeneralPanel($(this));
	});
	$(".controlLedList li").click(function(){
		var color = $(this).children(".generalGraphsListIndicador").data("color");
		$(this).children(".generalGraphsListIndicador").animate({
			backgroundColor: color,
			borderColor: color
		},600);
	});
	$("#dashboardControlSwithOn").click(function(){
		if (($("#ControlConexionArduino .dashboardControlButtons").css("background-color")==colorGreen) && ($("#ControlFlujoSistema .dashboardControlButtons").css("background-color")==colorGreen)){
			//Orden colores: Rojo(1), Azul(2), Verde(3)
			socket.emit("IniciarMedicion",$("#colorSensor11").data("state")+","+$("#colorSensor12").data("state")+","+$("#colorSensor13").data("state")+","+$("#colorSensor21").data("state")+","+$("#colorSensor22").data("state")+","+$("#colorSensor23").data("state")+","+$("#colorSensor31").data("state")+","+$("#colorSensor32").data("state")+","+$("#colorSensor33").data("state"));
		}
		else{
			alert("Verificar conexion arduino");
		}
	});
}



