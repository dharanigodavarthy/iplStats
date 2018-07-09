var csv = require("fast-csv");
const path = require('path');
const matches = path.resolve('ipl/matches.csv');
const deliveries = path.resolve('ipl/deliveries.csv');
const matchesPerYear=(matches)=>{
    return new Promise(function(resolve, reject) {
        const matchPerYear = {}
        let stream = csv.fromPath(matches, {
                headers: true
            })
            .on("data", function(row) {
                stream.pause();
                if (row.season !== '') {
                    matchPerYear[row.season] = matchPerYear[row.season] ? Number(matchPerYear[row.season]) + 1 : 1;
                }
                stream.resume();

            })
            .on('end', function() {
                console.log(matchPerYear);
                console.log("finished matches");

                resolve(matchPerYear);
            });
    });
}

matchesPerYear(matches);
module.exports={
    matchesPerYear:matchesPerYear
}