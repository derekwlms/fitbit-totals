'use strict';

module.exports = class FitbitAggregator {
    constructor({activities = []}) {
        this.activities = activities;
    }

    getTotals() {
        let totals = {};
        this.activities.forEach(activity => {
            let activityStats = totals[activity.activityName] || { name: activity.activityName, count: 0, duration: 0, steps: 0, distance: 0, calories: 0 };
            activityStats.count++;
            activityStats.duration += activity.duration || 0;
            activityStats.steps += activity.steps || 0;
            activityStats.distance += activity.distance || 0;
            activityStats.calories += activity.calories || 0;
            totals[activity.activityName] = activityStats;
        });
        return Object.keys(totals).map(key => totals[key]);
    }

    getTotalsHtmlTemplate() {
        return `
        <table border="1">
            <thead>
                <tr>
                    <th>Activity</th>
                    <th>Count</th>
                    <th>Duration</th>
                    <th>Steps</th>
                    <th>Distance</th>
                    <th>Calories</th>
                </tr>
            </thead>
            <tbody>
                <% for(var i=0; i < activityTotals.length; i++) { %>
                    <tr>
                        <td><%= activityTotals[i].name %></td>
                        <td><%= activityTotals[i].count %></td>
                        <td><%= (activityTotals[i].duration / 1000 / 60).toFixed(2) %></td>
                        <td><%= activityTotals[i].steps %></td>
                        <td><%= (activityTotals[i].distance * 0.621371).toFixed(2) %></td>
                        <td><%= activityTotals[i].calories %></td>
                    </tr>
                <% } %>
            </tbody>
        </table>`;
    }
}