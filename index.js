#!/usr/bin/env node
// fitbit-totals
// See README.md

const express = require("express");
const FitbitApiClient = require("fitbit-node");
var localConfig = null;
try { localConfig = require('./local-config.json') } catch(e) {};
const config = localConfig || require('./config.json');

const port = process.env.PORT || config.port || 3000;
const baseUrl = 'http://localhost:' + port + '/';

const fitbitProfileUrl = '/profile.json';
const fitbitActivitiesUrl = '/activities/recent.json';
// const fitbitActivitiesUrl = '/activities/list.json?afterDate=2018-01-01&offset=0&limit=50&sort=asc';

const app = express();
const client = new FitbitApiClient({
	clientId: config.clientId,
	clientSecret: config.clientSecret,
	apiVersion: '1.2'
});

// Register the /totals landing page
app.get("/totals", (req, res) => {
    // Redirect to the Fitbit authorization page
    const callbackUrl = baseUrl + 'callback';
    const scopes = 'activity heartrate location profile';
	res.redirect(client.getAuthorizeUrl(scopes, callbackUrl));
});

// Handle the callback from the Fitbit authorization flow
app.get("/callback", (req, res) => {
	// Exchange the authorization code we just received for an access token
	client.getAccessToken(req.query.code, 'http://localhost:3000/callback').then(result => {
		// Use the access token to fetch recent activities
		client.get(fitbitActivitiesUrl, result.access_token).then(results => {
			res.send(results[0]);
		}).catch(err => {
			res.status(err.status).send(err);
		});
	}).catch(err => {
		res.status(err.status).send(err);
	});
});

console.log('Open your browser to ' + baseUrl + 'totals');
app.listen(port);
