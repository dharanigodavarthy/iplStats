const express = require('express');
const path = require('path');
const fs = require('fs');
const matches = path.resolve('ipl/matches.csv');
const deliveries = path.resolve('ipl/deliveries.csv');
const fileName = path.resolve("iplStats.js");
const operations = require(fileName);

const app = express();
app.use('/assets', express.static('assets'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
app.get('/matchesPerYear', (req, res) => {
    operations.matchesPerYear(matches).then(function (data) {
        res.send(data);
    });
})
app.get('/extraRunsConcededPerTeam', (req, res) => {
    operations.extraRunsPerTeam('2016',matches,deliveries).then(function (data) {
        res.send(data);
    });
})
app.get('/topEconomicalBowlers', (req, res) => {
    operations.topEconomicalBowlers('2015',matches,deliveries).then(function (data) {
        res.send(data);
    });
})

app.listen(3000);
console.log('listening');