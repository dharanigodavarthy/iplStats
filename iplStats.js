var csv = require("fast-csv");
const fs = require('fs');
const path = require('path');
const matches = path.resolve('ipl/matches.csv');
const deliveries = path.resolve('ipl/deliveries.csv');
const matchescsv = path.resolve("ipl/matches_test1.csv");

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
                //console.log("first one solution");
                resolve(matchPerYear);
            });
    });
}


const calculateMatchesWonPerYear = (matches) => {
    return new Promise(function (resolve, reject) {
        let teamWonRecord = {};
        fs.readFile(matches, function (err, data) {
            if (err)
                reject(err);
            else {
                data.toString().split("\n").forEach(function (line, index, arr) {
                    if (index != 0) {
                        const match = line.split(",");
                        const winner = match[10];
                        const season = match[1];
                        if (winner && season) {
                            if (teamWonRecord.hasOwnProperty(winner)) {
                                if (teamWonRecord[winner].hasOwnProperty(season))
                                    teamWonRecord[winner][season]++;
                                else
                                    teamWonRecord[winner][season] = 1;
                            } else {
                                teamWonRecord[winner] = {};
                                teamWonRecord[winner][season] = 1;
                            }
                        }
                    }
                })
            
            }
            //console.log(teamWonRecord);
            resolve(teamWonRecord);
        })

    })
}


function maxRunsPerOver(deliveries) {
    return new Promise(function (resolve, reject) {
        let PlayersData = {},
            previousPlayer = null,
            players = {};
        fs.readFile(deliveries, function (err, balls) {
            if (err) {
                reject(err)
            } else {
                balls.toString().split("\n").forEach(function (ball, index, arr) {
                    if (index !== 0) {
                        const player = ball.split(",");
                        const bowler = player[8];
                        const totalRuns = player[17];
                        if (PlayersData.hasOwnProperty(bowler)) {
                            PlayersData[bowler] += parseInt(totalRuns);
                            previousPlayer = bowler;
                            if (players.hasOwnProperty(previousPlayer)) {
                                if (players[previousPlayer] < PlayersData[previousPlayer])
                                    players[previousPlayer] = PlayersData[previousPlayer];
                            }
                        } else {
                            PlayersData = {};
                            PlayersData[bowler] = parseInt(totalRuns);
                            if (!(players.hasOwnProperty(bowler))) {
                                players[bowler] = 0;
                            }
                        }
                    }
                })
            }
            //console.log(players);
            let playersRunsPerOver = [];

            for (let player in players) {
                let playerObject = {
                    'name': player,
                    'data': players[player]
                }
                playersRunsPerOver.push(playerObject);
            }
            playersRunsPerOver.sort(function (a, b) {
                if (a.data > b.data)
                    return -1;
                else
                    return 1;
            });
            // console.log(playersRunsPerOver.slice(0, 10));
            let maxRunsPerOverData = playersRunsPerOver.slice(0, 10);
            let playerData = {};
            maxRunsPerOverData.forEach((player) => {
                playerData[player.name] = player.data;
            })
            //console.log(playerData);
            resolve(playerData)
        })
    })
}


//3.For the year 2016 plot the extra runs conceded per team.
const getMatchID = (year, matches) => {
    var matchIds = [];
    return new Promise(function (resolve, reject) {
        fs.readFile(matches, function (err, matches) {
            if (err) {
                reject(err)
            } else {
                matches.toString().split("\n").forEach(function (team, index, arr) {
                    if (team !== 0) {
                        const match = team.split(",");
                        if (year == match[1]) {
                            matchIds.push(match[0]);
                        }
                    }
                })
            }
            //console.log("matchIds");
            resolve(matchIds)
        })
    })
}

function extraRunsPerTeam(year, matches, deliveries) {
    return new Promise(async function (resolve, reject) {
        let extraRunsPerTeam = {}
        let matchIds = await getMatchID(year, matches);
        fs.readFile(deliveries, function (err, data) {
            if (err) {
                reject(err)
            } else {
                data.toString().split("\n").forEach(function (line, index, arr) {
                    if (index !== 0) {
                        const delivery = line.split(",")
                        const bowlingTeam = delivery[3]
                        const extraRuns = delivery[16]
                        if (matchIds.includes(delivery[0])) {
                            if (extraRunsPerTeam.hasOwnProperty(bowlingTeam)) {
                                extraRunsPerTeam[bowlingTeam] += Number(extraRuns)
                            } else {
                                extraRunsPerTeam[bowlingTeam] = Number(extraRuns)
                            }
                        }
                    }
                })
            }
            //console.log("extraRunsPerTeam");
            resolve(extraRunsPerTeam);
        })
    })
}


function topEconomicalBowlers(year, matches, deliveries) {
    return new Promise(async function (resolve, reject) {
        let balls = [];
        let specificYearIds = await getMatchID(year, matches);
        fs.readFile(deliveries, function (err, data) {
            if (err) {
                reject(err)
            } else {
                data.toString().split("\n").forEach(function (line, index, arr) {
                    if (index !== 0) {
                        const ball = line.split(",")
                        if (specificYearIds.includes(ball[0])) {
                            if (!balls[ball[8]]) {
                                balls[ball[8]] = {
                                    "total_run": 0,
                                    "noOfBall": 0,
                                    "over": 0,
                                    'economy_rate': 0
                                };
                            }
                            balls[ball[8]].total_run += parseInt(ball[17]);
                            balls[ball[8]].noOfBall++;
                            if (ball[10] != 0) {
                                balls[ball[8]].noOfBall--;
                            } else if (ball[13] != 0) {
                                balls[ball[8]].noOfBall--;
                            }
                        }
                    }
                })
            }
            // console.log(balls);
            let economyRates = [];
            for (let player in balls) {
                balls[player].over = parseInt(balls[player].noOfBall) / 6;
                balls[player].economy_rate = balls[player].total_run / balls[player].over;
                let playerObject = {
                    'name': player,
                    'data': balls[player].economy_rate
                }
                economyRates.push(playerObject);
            }
            economyRates.sort(function (a, b) {
                if (parseFloat(a.data.toFixed(3)) < parseFloat(b.data.toFixed(3)))
                    return -1;
                else
                    return 1;
            });
            // console.log(economyRates.slice(0, 10));
            let maxRunsPerOverData = economyRates.slice(0, 10);
            let playerData = {};
            maxRunsPerOverData.forEach((player) => {
                playerData[player.name] = player.data;
            })
            //console.log(playerData);
            resolve(playerData);
        })
    })
}
module.exports = {
    matchesPerYear: matchesPerYear,
    calculateMatchesWonPerYear: calculateMatchesWonPerYear,
    getMatchID: getMatchID,
    extraRunsPerTeam: extraRunsPerTeam,
    topEconomicalBowlers: topEconomicalBowlers,
    maxRunsPerOver: maxRunsPerOver

}