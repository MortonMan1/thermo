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
/*
TODO: sort out API calls to website.
*/
var newCalltimer = setInterval(callserver2, 10000);

const axios = require('axios')


function callserver2(){

  console.log("here we call the axios");

  /*axios.get('http://192.168.0.28:58938/api/thermo/getTest')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
  //#endregion
  
  
  
        Temperature { get; set; }
        public int TimeOn { get; set; }
        public int LastUpdated
  */

  //get temp and deets

  var data = myModule.statusToPost();

  const obj = JSON.stringify(data);

  //console.log(data);
  //console.log(obj);

  axios({
    method: 'post',
    url: 'http://192.168.0.28:58938/api/thermo/',
    data: data,
    }).then((res) => {
      console.log(`statusCode: ${res.statusCode}`)
      console.log(res)
    })
    .catch((error) => {
      console.error(error)
    });


  /*axios.post('http://192.168.0.28:58938/api/thermo/', {
    Temperature: data.Temperature,
		TimeOn: data.TimeOn,
		LastUpdated: data.LastUpdated
  })
  .then((res) => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res)
  })
  .catch((error) => {
    console.error(error)
  })*/
}

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

/*
TODO: sort out API calls to website.

function callserver(){
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

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.post('/', function(req, res) {
	console.log('post');
    return res.send('Received a POST HTTP method');
});

// POST method route
app.post('/pos', function (req, res) {
  res.send('POST request to the homepage')
})

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
