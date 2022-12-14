// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
let dotenv = require("dotenv").config();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

function getUnix(date) {
  return date.getTime();
}

function getUTC(date) {
  return date.toUTCString();
}

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});



// Check date middleware
function checkDate(req, res, next) {
  let rawDate = req.params.date;
  // if input date empty
  if (!rawDate) {
    console.error("Date is empty!");
    let date = new Date();
    res.json({ unix: getUnix(date), utc: getUTC(date) });
    return;
  }

  let date = new Date(rawDate);

  // if input date invalid
  if (isNaN(date)) {
    let number = Number(rawDate);
    if (isNaN(number)) { // Check if rawDate is a number, if it is then use it to get Date
      console.error("Date is invalid!");
      res.json({ error: "Invalid Date" });
      return;
    }
    date = new Date(number);
  }

  req.params.date = date;


  next();
}

// Date API handler
function dateHandler(req, res) {
  console.log("Processing date...");
  let date = req.params.date;
  let unix = getUnix(date);
  let utc = getUTC(date);
  res.json({ unix, utc });
}

// date api
app.get("/api/:date?", checkDate, dateHandler);


console.log(process.env.PORT);
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
