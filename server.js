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
app.get('/matchesPerYear',async (req, res) => {
    const data= await operations.matchesPerYear(matches);
        res.send(data);
})
app.get('/MatchesWonPerYear',async (req, res) => {
    const data= await operations.calculateMatchesWonPerYear(matches);
        res.send(data);
})
app.get('/extraRunsConcededPerTeam', async (req, res) => {
    const data= await operations.extraRunsPerTeam('2016',matches,deliveries);
        res.send(data);
})
app.get('/topEconomicalBowlers',async (req, res) => {
    const data= await operations.topEconomicalBowlers('2015',matches,deliveries);
        res.send(data);
})
app.get('/maxRunsPerOver', async (req, res) => {
    const data= await operations.maxRunsPerOver(deliveries);
        res.send(data);
})

app.listen(3000);
console.log('listening');