#!/usr/bin/env node
// fitbit-totals
// See README.md

const express = require("express");
const FitbitApiClient = require("fitbit-node");
var localConfig = null;
try { localConfig = require('./local-config.json') } catch(e) {};
const config = localConfig || require('./config.json');
const FitbitAggregator = require('./fitbit-aggregator');

const port = process.env.PORT || config.port || 3000;
const baseUrl = `http://localhost:${port}/`;
const callbackUrl = baseUrl + 'callback';
const fitbitActivitiesUrl = `/activities/list.json?afterDate=${new Date().getFullYear()}-01-01&offset=0&limit=100&sort=asc`;

const app = express();
const client = new FitbitApiClient({
	clientId: config.clientId,
	clientSecret: config.clientSecret
});

// Register the /totals landing page
app.get("/totals", (req, res) => {
    // Redirect to the Fitbit authorization page
    const scopes = 'activity';  // 'activity heartrate location profile';
	res.redirect(client.getAuthorizeUrl(scopes, callbackUrl));
});

// Handle the callback from the Fitbit authorization flow
app.get("/callback", (req, res) => {
	// Exchange the authorization code we just received for an access token
	client.getAccessToken(req.query.code, callbackUrl).then(result => {
		// Use the access token to fetch the activity logs list
		// TODO Add pagination since 100 is the max allowed limit
		client.get(fitbitActivitiesUrl, result.access_token).then(results => {
			const aggregator = new FitbitAggregator(results[0]);
			res.send(aggregator.getTotals());
		}).catch(err => {
			res.status(err.status).send(err);
		});
	}).catch(err => {
		res.status(err.status).send(err);
	});
});

console.log('Open your browser to ' + baseUrl + 'totals');
app.listen(port);
