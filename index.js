#!/usr/bin/env node
// fitbit-totals
// See README.md

const express = require("express");
const ejs = require('ejs');
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
const aggregator = new FitbitAggregator();

// Register the /totals landing page
app.get("/totals", (req, res) => {
    // Redirect to the Fitbit authorization page
    const scopes = 'activity';
    res.redirect(client.getAuthorizeUrl(scopes, callbackUrl));
});

// Handle the callback from the Fitbit authorization flow
app.get("/callback", (req, res) => {
    // Exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, callbackUrl).then(result => {
        // Use the access token to fetch the activity logs list
        // Fetch using pagination since 100 is the max allowed limit
        new Promise((resolve, reject) => {
            fetchActivities(fitbitActivitiesUrl, result.access_token, aggregator, resolve, reject)
        }).then(response => {
            let html = ejs.render(aggregator.getTotalsHtmlTemplate(), { activityTotals: aggregator.getTotals() });
            res.send(html);
        }).catch(err => {
            res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

var fetchActivities = (url, accessToken, aggregator, resolve, reject) => {
    console.log("Fetching activities", url);
    client.get(url, accessToken).then(results => {
        aggregator.addActivities(results[0].activities);
        let nextPageUrl = results[0].pagination.next;
        if (nextPageUrl) {
            let absoluteUrl = nextPageUrl.replace(client.getUrl(''), '');
            fetchActivities(absoluteUrl, accessToken, aggregator, resolve, reject);
        } else {
            resolve(aggregator);
        }
      });
};

console.log('Open your browser to ' + baseUrl + 'totals');
app.listen(port);
