#!/usr/bin/env node
// fitbit-activities
// Use client_credentials auth flow to retrieve a list of all available activities
// See README.md

const request = require('request');
var localConfig = null;
try { localConfig = require('../local-config.json') } catch(e) {};
const config = localConfig || require('../config.json');

// request.debug = true;

const authUrl = 'https://' + config.clientId + ':' + config.clientSecret + '@api.fitbit.com/oauth2/token';
const activitiesListUrl = 'https://api.fitbit.com/1/activities.json';

request.post(authUrl, { form: {grant_type: 'client_credentials', scope: 'activity' }, json: true }, (err, res, body) => {
  if (err) { 
    console.log(err);
    throw 'Authentication failure';
  }
  request.get(activitiesListUrl, { headers: {'Authorization': 'Bearer ' + body.access_token} }, (err, res, body) => {
    if (err) { 
      console.log(err);
      throw 'Error accessing activity';
    }
    console.log('Activities list:\n');
    // console.log(JSON.parse(body));
    console.dir(JSON.parse(body), {depth: null, colors: true})
  });
});
