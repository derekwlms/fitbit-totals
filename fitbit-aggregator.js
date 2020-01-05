'use strict';

module.exports = class FitbitAggregator {
    constructor({activities = []}) {
        this.activities = activities;
    }

    getTotals() {
        let totals = {};
        this.activities.forEach(activity => {
            let activityStats = totals[activity.activityName] || { count: 0, duration: 0, steps: 0, distance: 0, calories: 0 };
            activityStats.count++;
            activityStats.duration += activity.duration || 0;
            activityStats.steps += activity.steps || 0;
            activityStats.distance += activity.distance || 0;
            activityStats.calories += activity.calories || 0;
            totals[activity.activityName] = activityStats;
        });
        return totals;
    }
}