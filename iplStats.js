var csv = require("fast-csv");
const path = require('path');
const matches = path.resolve('ipl/matches.csv');
const deliveries = path.resolve('ipl/deliveries.csv');
const matchesPerYear = (matches) => {
    return new Promise(function (resolve, reject) {
        const matchPerYear = {}
        let stream = csv.fromPath(matches, {
                headers: true
            })
            .on("data", function (row) {
                stream.pause();
                if (row.season !== '') {
                    matchPerYear[row.season] = matchPerYear[row.season] ? Number(matchPerYear[row.season]) + 1 : 1;
                }
                stream.resume();

            })
            .on('end', function () {
                // console.log(matchPerYear);
                // if (err)
                //     reject(err);
                console.log("first one solution");
                resolve(matchPerYear);
            });
    });
}

//matchesPerYear(matches);
//Common Method to get id's from matches file
let getIds = function (year, matches) {
    return new Promise(function (resolve, reject) {
        let team_ids = [];
        let stream = csv.fromPath(matches, {
                headers: true
            })
            .on("data", function (match) {
                stream.pause();
                if (match.season == year) {
                    team_ids.push(match.id);
                }
                stream.resume();
            })
            .on('end', function () {
                //console.log(team_ids);
                resolve(team_ids);
            });
    });
};

let checkArray = function (id, team_ids) {
    let value = false;
    return new Promise(function (resolve, reject) {
        // console.log("inside checkarray");
        for (var each of team_ids) {
            if (id === each) {
                value = true;
            }
        }
        resolve(value);
    });

};
//third question
let extraRunsPerTeam = function (year, matches, deliveries) {
    // change to 2017 for testing
    let team_ids = getIds(year, matches);
    return new Promise(function (resolve, reject) {
        let extra_runs = {};
        let stream = csv.fromPath(deliveries, {
                headers: true
            })
            .on("data", function (delivery) {
                stream.pause();
                team_ids.then(function (ids) {
                    checkArray(delivery.match_id, ids).then(function (val) {
                        let idIsPresent = val;
                        // console.log(idIsPresent);
                        if (idIsPresent && (delivery != undefined)) {
                            extra_runs[delivery.bowling_team] = extra_runs.hasOwnProperty(delivery.bowling_team) ? parseInt(extra_runs[delivery.bowling_team]) + parseInt(delivery.extra_runs) :
                                delivery.extra_runs;
                        }
                        stream.resume();
                    });
                });
            })
            .on('end', function () {
                //console.log(extra_runs);
                console.log("finished extra runs");

                resolve(extra_runs);
            });
    });
};

//extraRunsPerTeam(year,matches, deliveries);
let topEconomicalBowlers = function (year, matches, deliveries) {
    let balls_array = {};
    let runs_array = {};
    let bowler_object = [];
    // change year to 2017 for testing
    let team_ids = getIds(year, matches);
    return new Promise(function (resolve, reject) {
        let stream = csv.fromPath(deliveries, {
                headers: true
            })
            .on("data", function (delivery) {
                stream.pause();
                team_ids.then(function (ids) {
                    checkArray(delivery.match_id, ids).then(function (val) {
                        let idIsPresent = val;
                        if (idIsPresent && (delivery != undefined)) {
                            if (balls_array.hasOwnProperty(delivery.bowler)) {
                                balls_array[delivery.bowler] = parseInt(balls_array[delivery.bowler]) + 1;
                                runs_array[delivery.bowler] = parseInt(runs_array[delivery.bowler]) + parseInt(delivery.total_runs);
                                if (delivery.wide_runs > 0)
                                    balls_array[delivery.bowler] = parseInt(balls_array[delivery.bowler]) - 1;
                                if (delivery.noball_runs > 0)
                                    balls_array[delivery.bowler] = parseInt(balls_array[delivery.bowler]) - 1;

                            } else {
                                balls_array[delivery.bowler] = 1;
                                runs_array[delivery.bowler] = parseInt(delivery.total_runs);
                                if (delivery.wide_runs > 0)
                                    balls_array[delivery.bowler] = parseInt(balls_array[delivery.bowler]) - 1;
                                if (delivery.noball_runs > 0)
                                    balls_array[delivery.bowler] = parseInt(balls_array[delivery.bowler]) - 1;

                            }
                        }
                        stream.resume();

                    });
                });
            })
            .on('end', function () {
                for (let each in balls_array) {
                    bowler_object.push({
                        'name': each,
                        'economy_rate': Math.floor(runs_array[each] / (balls_array[each] / 6))
                    });
                }
                bowler_object.sort(function (a, b) {
                    return (parseInt(a.economy_rate) - parseInt(b.economy_rate));
                });
                // console.log(bowler_object);
                console.log("finished top eco bowlers");
                if (bowler_object.length > 10)
                    bowler_object = bowler_object.slice(0, 10);
                console.log(bowler_object);
                resolve(bowler_object);
            });
    });
};
//topEconomicalBowlers('2015', matches, deliveries);
//extraRunsPerTeam('2016',matches,deliveries)
module.exports = {
    matchesPerYear: matchesPerYear,
    getIds: getIds,
    extraRunsPerTeam: extraRunsPerTeam,
    topEconomicalBowlers: topEconomicalBowlers
}