# Fitbit Totals

> Calculate totals for Fitbit activities.

<em>fitbit-totals</em> is a simple node.js express app that calls the Fitbit APIs to fetch activity data for a time period. 
It then calculates and shows various totals (such as total miles) over that time.

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
- Copy `config.json` to `local-config.json` and update it with your `clientId` and `clientSecret`. You can get these from the [Fitbit app console](https://dev.fitbit.com/apps).
- If developing in Chromebook's penguin, use [Connection Forwarder](https://chrome.google.com/webstore/detail/connection-forwarder/ahaijnonphgkgnkbklchdhclailflinn/related) for `localhost` redirect access in Chrome.
- This uses the OAuth2 [authorization_code](https://dev.fitbit.com/build/reference/web-api/oauth2/#authorization-code-grant-flow) grant flow, requiring a browser redirect and callback. It uses the [fitbit-node](https://github.com/lukasolson/fitbit-node) package for the logistics.
- The Fitbit API has limited support for the [client_credentials](https://dev.fitbit.com/build/reference/web-api/client-credentials/) 
(two-legged) grant flow. While this would be very handy for server-server, it cannot be used for Fitbit's user data scopes. See the `alternative` folder for an example of using client_credentials to retrieve available activities.
