/**
 *  I used the starter code provided by udacity in the course content
 */

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();

// Require body-parser
const bodyParser = require("body-parser");

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server. using port number 3000
const port = 3000;

//spinning the server up
const server = app.listen(port, serverListening);
//callback to make sure the server is up and running
// and producing feedback to the Command Line through a working callback function.
function serverListening() {
  console.log("server is up and running");
  console.log(`running on port: ${port}`);
}

/**
 * Setting up the routes
 */
//setting up a post route
app.post("/routeToPostData", addingData);
function addingData(req, res) {
  projectData = {
    date: req.body.date,
    temp: req.body.temp,
    content: req.body.content,
  };
  console.log("Data saved:", projectData); // Debugging to see what's being saved

  // sending feedback when successfull
  // this part I added because the Post request status kept being pending
  // and after five requests the app ui freezes.
  res.send({ status: "Successfull POST" });
}

//setting up a get route
app.get("/routeToGetData", sendingData);
function sendingData(req, res) {
  res.send(projectData);
}
