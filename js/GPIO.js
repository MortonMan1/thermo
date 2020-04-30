
//var module = require('./moment.js');

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var thermoSensor = require('ds18x20');

var isLoaded = thermoSensor.isDriverLoaded();
if(!isLoaded){
	console.log('driver is loadin');
	try {
		thermoSensor.loadDriver();
		console.log('driver is loaded');
	} catch (err) {
		console.log('something went wrong loading the driver:', err)
	}
}
else{
	var listOfDeviceIds = thermoSensor.list();
	console.log(listOfDeviceIds);
	var temp = thermoSensor.get(listOfDeviceIds[0]);
	console.log(temp);
}

var digitToDisplay = 0;
var segdigitinterval = setInterval(getThermo, 5000);
var listOfSensorIds = '';
thermoSensor.list(function (err, listOfDeviceIds) {
	//console.log(listOfDeviceIds);
	listOfSensorIds = listOfDeviceIds[0];
});
function getThermo() {
	thermoSensor.get(listOfSensorIds, function (err, temp) {
		//console.log("temp", temp);
		digitToDisplay = parseInt(temp);
	});
}

//Outputs
var heatingPin = new Gpio(12, 'out');
var seven_Seg_1 = new Gpio(2, 'out');
var seven_Seg_2 = new Gpio(3, 'out');

var seven_Seg_A = new Gpio(21, 'out');
var seven_Seg_B = new Gpio(20, 'out');
var seven_Seg_C = new Gpio(26, 'out');
var seven_Seg_D = new Gpio(19, 'out');
var seven_Seg_E = new Gpio(13, 'out');
var seven_Seg_F = new Gpio(6, 'out');
var seven_Seg_G = new Gpio(5, 'out');

var bar_Light_1 = new Gpio(23, 'out');
var bar_Light_2 = new Gpio(14, 'out');
var bar_Light_3 = new Gpio(24, 'out');
var bar_Light_4 = new Gpio(18, 'out'); //17
var bar_Light_5 = new Gpio(22, 'out');
var bar_Light_6 = new Gpio(15, 'out');
var bar_Light_7 = new Gpio(27, 'out');
//var bar_Light_8 = new Gpio(17, 'out'); //pin 17 broke?
var bar_Light_8 = new Gpio(10, 'out');

//var thermoData = new Gpio(4, 'in');

//Inputs
var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled


seven_Seg_1.write(0);
seven_Seg_2.write(0);

var timeOfOn = 0;
var updatedDigit = 0;
var changeToDisplay = false;
var seven_Seg_1_Control = false;
var seven_Seg_2_Control = false;


var setDigit = setInterval(digitClk, 10);

function digitClk(){
	//console.log("123", digitToDisplay);
	//for(var i = 0; i < 1000; i++){
		seven_Seg_A.write(1);
		seven_Seg_B.write(1);
		seven_Seg_C.write(1);
		seven_Seg_D.write(1);
		seven_Seg_E.write(1);
		seven_Seg_F.write(1);
		seven_Seg_G.write(1);

		if(seven_Seg_1_Control == true){
			seven_Seg_1_Control = false;
			seven_Seg_2_Control = true;
			seven_Seg_1.write(0);
			seven_Seg_2.write(1);
		}
		else{
			seven_Seg_1_Control = true;
			seven_Seg_2_Control = false;
			seven_Seg_1.write(1);
			seven_Seg_2.write(0);
		}

		setDisplay(digitToDisplay);
//	}
}

//var segdigitinterval = setInterval(flashLightBar, 80);
//console.log("wok");
bar_Light_1.writeSync(1);
bar_Light_2.writeSync(1);
bar_Light_3.writeSync(1);
bar_Light_4.writeSync(1);
bar_Light_5.writeSync(1);
bar_Light_6.writeSync(1);
bar_Light_7.writeSync(1);
bar_Light_8.writeSync(1);

var count8 = 0;
function flashLightBar() {

	//console.log("wok");
	bar_Light_1.writeSync(0);
	bar_Light_2.writeSync(0);
	bar_Light_3.writeSync(0);
	bar_Light_4.writeSync(0);
	bar_Light_5.writeSync(0);
	bar_Light_6.writeSync(0);
	bar_Light_7.writeSync(0);
	bar_Light_8.writeSync(0);

	//console.log("sdfsdf 1");
	if(count8 == 8){
		count8 = 0;
	}
	
	if(count8 == 0){
		bar_Light_1.write(1);
	}
	else if(count8 == 1){
		bar_Light_2.writeSync(1);
	}
	else if(count8 == 2){
		bar_Light_4.writeSync(1);
	}
	else if(count8 == 3){
		bar_Light_6.writeSync(1);
	}
	else if(count8 == 4){
		bar_Light_8.writeSync(1);
	}
	else if(count8 == 5){
		bar_Light_7.writeSync(1);
	}
	else if(count8 == 6){
		bar_Light_5.writeSync(1);
	}
	else if(count8 == 7){
		bar_Light_3.writeSync(1);
	}

	count8++;
}


var myHeatTimer = null;

var tempTest = function() {
	var listOfDeviceIds = thermoSensor.list();
	//console.log(listOfDeviceIds);

	var temp = thermoSensor.get(listOfDeviceIds[0]);
	//console.log(temp);

	return temp;
}

var getTemperature = function() {	
	var listOfDeviceIds = thermoSensor.list();
	//console.log(listOfDeviceIds);

	var temp = thermoSensor.get(listOfDeviceIds[0]);
	digitToDisplay = parseInt(temp);

	return { message: 'Temperature', temperature: digitToDisplay };  
}

var test123 = function() {
	return { message: 'Here is test message' };  
}

var turnHeatingOn = function(){
	heatingPin.write(0);

	segdigitinterval = setInterval(flashLightBar, 80);

	//get time
	var dt1 = new Date();
	var timeTurnedOn = dt1.getDate();

	myHeatTimer = setInterval(onTimer, 1000);

	function onTimer() {
		var dt2 = new Date();
		var timeNEachLoop = dt2.getDate();
		var difference = dt2 - dt1;

		timeOfOn = difference;

		var timesUp = 120 * 60 * 1000;  // mins, secs, millisecs
		if(difference > timesUp){
		  turnHeatingOff();
		  clearInterval(segdigitinterval);
		  stopOnTimer();
		}
	}

	function stopOnTimer() {
		clearInterval(myHeatTimer);
	}
}

var heatingOff = function() {
	turnHeatingOff();
	return { message: 'Heating Off.', result: true };  
}

var turnHeatingOff = function(){
	heatingPin.write(1);
	clearInterval(myHeatTimer);
	clearInterval(segdigitinterval);
}

var getHeatingStatus = function(){
	//var nowDate = moment();

	//console.log(nowDate);
	if (heatingPin.readSync() === 0) {
		//module.exports.turnHeatingOn();
		//turnHeatingOn();
		return { 
			message: 'Heating is ON.',
			time: timeOfOn
		};  
	} else {
		//turnHeatingOff();
		object = { message: 'Heating is OFF.' };  
		return object;
	}
}

var toggleHeating = function() {
	console.log("qwe");
	if (heatingPin.readSync() === 0) { //check the pin state, if the state is 0 (or off)
		//to do : fix this bit , re run server.js and test on linux pc
		console.log("off1");
		turnHeatingOFF1();
		return { message: 'Heating OFF.' };  
	} else {
		console.log("on1");
		turnHeatingON1()
		return { message: 'Heating ON.' };  
	}
}

var heatingOn = function() {
	turnHeatingOn();
	return { message: 'Heating ON.', result: true };  
}

var stopOnTimer2 = function() {
	clearInterval(myHeatTimer);
}

var setDigit = function(numberToShow) {
	digitToDisplay = numberToShow;
	changeToDisplay = true;
}


/* 
 * TODO:
 * module.exports = { printTest, tempTest, etc}
 * Simplify functioncalling in module exports
 */
module.exports = {
	tempTest,
	getTemperature,
	getHeatingStatus,
	test123,
	toggleHeating,
	heatingOn,
	heatingOff,
	turnHeatingOn,
	turnHeatingOff, 
	stopOnTimer2,
	setDigit
}
	


var segdigitinterval = null;

function turnHeatingON1(){
	heatingPin.write(0);
	segdigitinterval = setInterval(flashLightBar, 80);

	//get time
	var dt1 = new Date();
	var timeTurnedOn = dt1.getDate();

	myHeatTimer = setInterval(onTimer, 1000);
	
	console.log("timer set1: ", segdigitinterval);
	console.log("timer set2: ", myHeatTimer);
	function onTimer() {
		var dt2 = new Date();
		var timeNEachLoop = dt2.getDate();
		var difference = dt2 - dt1;

		timeOfOn = difference;

		var timesUp = 100 * 20 * 1000;  // mins secs, millisecs
		if(difference > timesUp){
		  console.log("timer fiinished: ");
		  turnHeatingOFF();
		  stopOnTimer();
		  
		  clearInterval(segdigitinterval);
		}
	}

	function stopOnTimer() {
		clearInterval(segdigitinterval);
		clearInterval(myHeatTimer);
		console.log("timers fin: ", segdigitinterval);
		console.log("timers fin2: ", myHeatTimer);
	}
}

function turnHeatingOFF1(){
	
	clearInterval(segdigitinterval);
	clearInterval(myHeatTimer);
	console.log("timers fin: ", segdigitinterval);
	console.log("timers fin2: ", myHeatTimer);
	heatingPin.write(1);
	//stopOnTimer2();

	bar_Light_1.writeSync(0);
	bar_Light_2.writeSync(0);
	bar_Light_3.writeSync(0);
	bar_Light_4.writeSync(0);
	bar_Light_5.writeSync(0);
	bar_Light_6.writeSync(0);
	bar_Light_7.writeSync(0);
	bar_Light_8.writeSync(0);
}

function setDisplay(numberToShow) {
	var digitToShow = 0;

	if(numberToShow > 9){
		var digits = numberToShow.toString().split('');
		var digitArray = digits.map(Number);

		if(seven_Seg_1_Control){
			digitToShow = digitArray[0];
		}
		else if(seven_Seg_2_Control){
			digitToShow = digitArray[1];
		}
	}
	else{
		if(seven_Seg_1_Control){
			digitToShow = 10;
		}
		else if(seven_Seg_2_Control){
			digitToShow = numberToShow;
		}
	}

	

	if(digitToShow == 0){
		seven_Seg_A.write(0);
		seven_Seg_B.write(0);
		seven_Seg_C.write(0);
		seven_Seg_D.write(0);
		seven_Seg_E.write(0);
		seven_Seg_F.write(0);
		seven_Seg_G.write(1);
	}
	else if(digitToShow == 1){
		seven_Seg_A.write(1);
		seven_Seg_B.write(0);
		seven_Seg_C.write(0);
		seven_Seg_D.write(1);
		seven_Seg_E.write(1);
		seven_Seg_F.write(1);
		seven_Seg_G.write(1);
	}
	else if(digitToShow == 2){
		seven_Seg_A.write(0);
		seven_Seg_B.write(0);
		seven_Seg_C.write(1);
		seven_Seg_D.write(0);
		seven_Seg_E.write(0);
		seven_Seg_F.write(1);
		seven_Seg_G.write(0);
	}
	else if(digitToShow == 3){
		seven_Seg_A.write(0);
		seven_Seg_B.write(0);
		seven_Seg_C.write(0);
		seven_Seg_D.write(0);
		seven_Seg_E.write(1);
		seven_Seg_F.write(1);
		seven_Seg_G.write(0);
	}
	else if(digitToShow == 4){
		seven_Seg_A.write(1);
		seven_Seg_B.write(0);
		seven_Seg_C.write(0);
		seven_Seg_D.write(1);
		seven_Seg_E.write(1);
		seven_Seg_F.write(0);
		seven_Seg_G.write(0);
	}
	else if(digitToShow == 5){
		seven_Seg_A.write(0);
		seven_Seg_B.write(1);
		seven_Seg_C.write(0);
		seven_Seg_D.write(0);
		seven_Seg_E.write(1);
		seven_Seg_F.write(0);
		seven_Seg_G.write(0);
	}
	else if(digitToShow == 6){
		seven_Seg_A.write(0);
		seven_Seg_B.write(1);
		seven_Seg_C.write(0);
		seven_Seg_D.write(0);
		seven_Seg_E.write(0);
		seven_Seg_F.write(0);
		seven_Seg_G.write(0);
	}
	else if(digitToShow == 7){
		seven_Seg_A.write(0);
		seven_Seg_B.write(0);
		seven_Seg_C.write(0);
		seven_Seg_D.write(1);
		seven_Seg_E.write(1);
		seven_Seg_F.write(1);
		seven_Seg_G.write(1);
	}
	else if(digitToShow == 8){
		seven_Seg_A.write(0);
		seven_Seg_B.write(0);
		seven_Seg_C.write(0);
		seven_Seg_D.write(0);
		seven_Seg_E.write(0);
		seven_Seg_F.write(0);
		seven_Seg_G.write(0);
	}
	else if(digitToShow == 9){
		seven_Seg_A.write(0);
		seven_Seg_B.write(0);
		seven_Seg_C.write(0);
		seven_Seg_D.write(0);
		seven_Seg_E.write(1);
		seven_Seg_F.write(0);
		seven_Seg_G.write(0);
	}	
	else if(digitToShow == 10){
		seven_Seg_A.write(1);
		seven_Seg_B.write(1);
		seven_Seg_C.write(1);
		seven_Seg_D.write(1);
		seven_Seg_E.write(1);
		seven_Seg_F.write(1);
		seven_Seg_G.write(1);
	}
}