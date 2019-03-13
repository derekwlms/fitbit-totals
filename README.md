# Fitbit Totals

> Calculate totals (week, month, year) for Fitbit activities.

## **Under Construction**

<em>fitbit-totals</em> is a simple node.js express app that calls the Fitbit APIs to fetch activity data and
calculate various totals such as total miles for the current week, month, and year.

It fills gaps left by the (otherwise awesome) [Fitbit app](https://play.google.com/store/apps/details?id=com.fitbit.FitbitMobile&hl=en_US) 
and [web site](https://www.fitbit.com/).

## Running Locally

Pre-requisites: [git](https://git-scm.com/) and  [node.js](https://nodejs.org).

1. `git clone https://github.com/derekwlms/fitbit-totals.git`
2. `cd fitbit-totals && npm install`
3. `node index.js`
4. Open your browser to http://localhost:3000/totals

Optional: Run `npm i -g` to enable running `fitbit-totals` directly from the command line.

## Notes
- Update `config.json` with your `clientId` and `clientSecret`. You can get these from the [Fitbit app console](https://dev.fitbit.com/apps).
- This uses the OAuth2 [authorization_code](https://dev.fitbit.com/build/reference/web-api/oauth2/#authorization-code-grant-flow) grant flow, requiring a browser redirect and callback. It uses the awesome [fitbit-node](https://github.com/lukasolson/fitbit-node) package for the logistics.
- The Fitbit API has limited support for the [client_credentials](https://dev.fitbit.com/build/reference/web-api/client-credentials/) 
(two-legged) grant flow. While this would be very handy for server-server, it cannot be used for Fitbit's user data scopes.
