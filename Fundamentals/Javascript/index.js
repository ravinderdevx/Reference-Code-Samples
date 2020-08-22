'use strict';

/**
 * Load Twilio configuration from .env config file - the following environment
 * variables should be set:
 * process.env.TWILIO_ACCOUNT_SID
 * process.env.TWILIO_API_KEY
 * process.env.TWILIO_API_SECRET
 */
require('dotenv').load();

var http = require('http');
var path = require('path');
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var express = require('express');
var randomName = require('./randomname');

// Create Express webapp.
var app = express();

// Set up the paths for the examples.
[
  'bandwidthconstraints',
  'codecpreferences',
  'localvideofilter',
  'localvideosnapshot',
  'mediadevices'
].forEach(function(example) {
  var examplePath = path.join(__dirname, `../examples/${example}/public`);
  app.use(`/${example}`, express.static(examplePath));
});

// Set up the path for the video.
var videoPath = path.join(__dirname, '../video/public');
app.use('/video', express.static(videoPath));

// Set up the path for the examples page.
var examplesPath = path.join(__dirname, '../examples');
app.use('/examples', express.static(examplesPath));

/**
 * Default to the Quick Start application.
 */
app.get('/', function(request, response) {
	
	
  response.redirect('/video');
});

/**
 * Generate an Access Token for a chat application user - it generates a random
 * username for the client requesting a token, and takes a device ID as a query
 * parameter.
 */
app.get('/token', function(request, response) {
  var identity = randomName();

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
 
  var token = new AccessToken(
  
 // 'ACd1fbc9165a5a2ad6df57e01a9708b73b','SK1f91cc9894d70ae97444747d424dd526','ZqmhRYOVpkirb5VTOenul9beGjiSeQwS'
    'AC6ddebb486b35f2d70571b92269a74260','SK15e69cf1cb97f7a616a0000c37b485a7','UaUluOB7uu2TWWiNnzHsoVWeM0HcCrow'
    //process.env.TWILIO_ACCOUNT_SID,
    //process.env.TWILIO_API_KEY,
    //process.env.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  var grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});

// Create http server and run it.
//var server = http.createServer(app);
// port = process.env.PORT || 3000;
app.listen(process.env.PORT);
