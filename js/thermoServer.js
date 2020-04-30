/*var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
*/

var myModule = require('./GPIO.js');
var variables = require('./variables.js');
const https = require('https');
const http = require('http');

var euanMortonIP = variables.euanMortonIP();


// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  console.log('get');
  res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/getHeatingStatus', function(req, res) {
  var heatingStstus = myModule.getHeatingStatus();
  res.json(heatingStstus);
});

router.get('/toggleHeatingPin', function(req, res) {
  res.json(myModule.toggleHeating());
});
router.get('/heatingOn', function(req, res) {
  res.json(myModule.heatingOn());
});
router.get('/heatingOff', function(req, res) {
  res.json(myModule.heatingOff());
});
router.get('/getTemperature', function(req, res) {
  res.json(myModule.getTemperature());
});

router.get('/getThermoStatus', function(req, res) {
  var test = myModule.tempTest();
  res.json({ message: test });  
});


//var segdigitinterval = setInterval(pinCounter1, 400);
//var segdigitinterval = setInterval(getThermo, 1000);
function getThermo() {
  myModule.getTemp(numberToShow);
}

var numberToShow = 0;
function pinCounter1() {
  if(numberToShow == 99){
	  numberToShow = 0;
  }
   
  myModule.setDigit(numberToShow);

  numberToShow++;
}

//var newCalltimer = setInterval(callserver, 2000);

function callserver(){
  const data = JSON.stringify({
    todo: 'Buy the milk'
  })
  
  const options = {
    hostname: euanMortonIP + 'thermo',
    //port: 80,
    //path: '/todos',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }
  
  const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', (d) => {
      process.stdout.write(d)
      //data += chunk;
    })
  })

  req.on('error', (error) => {
    console.error(error)
  })
  
  req.write(data)
  req.end()
}
/*function callserver(){
  http.get('http://www.euanmorton.co.uk/api/thermo/getTest', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //console.log(JSON.parse(data));
      console.log("data");
      console.log(data);
    // console.log(JSON.parse(data).explanation);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}*/




/*setInterval(function(){ 
  var dt = new Date();
  var timeNow = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  var difference = timeNow - timeTurnedOn;
  console.log("interva checking...", difference);

  if(difference > (1 * 60 * 1000)){
    //bin on 60 secs turnoff
    turnHeatingOFF();
  }
}, 5000);*/
  


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.post('/', function(req, res) {
	console.log('post');
    return res.send('Received a POST HTTP method');
});

// POST method route
app.post('/pos', function (req, res) {
  res.send('POST request to the homepage')
})

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


/*const express = require('express');
const app = express();


app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});
app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});
app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});
app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);


/*http.listen(8080); //listen to port 8080

function handler (req, res) { //create server

    console.log("creatingreq");
  fs.readFile(__dirname + '/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
    console.log("creating123456");
  var lightvalue = 0; //static variable for current status
  pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    lightvalue = value;
    console.log("lightval", lightvalue);
    socket.emit('light', lightvalue); //send button status to client
  });
  socket.on('light', function(data) { //get light switch status from client
    console.log("lightval", data);
    lightvalue = data;
    if (lightvalue != LED.readSync()) { //only change LED if status has changed
      LED.writeSync(lightvalue); //turn LED on or off
    }
  });
});

process.on('SIGINT', function () { //on ctrl+c

    console.log("do the thing");
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});

/*


var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(17, 'out'); //use GPIO pin 4, and specify that it is output
//var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
  console.log("clickedblick");
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function ledon() { //function to start blinking
  console.log("clicked123");
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
  return "on";
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 5000); //stop blinking after 5 seconds


*/