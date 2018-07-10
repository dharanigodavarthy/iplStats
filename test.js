/*jshint esversion: 6 */
const expect = require("chai").expect;
const path = require('path');
const matches = path.resolve("ipl/matches_test.csv");
const matchescsv = path.resolve("ipl/matches_test1.csv");
const deliveries = path.resolve("ipl/deliveries_test.csv");
const fileName = path.resolve("iplStats.js");
const operations = require(fileName);

describe('operations', function () {
    //first question matches per year
    it("should return the number of matches per year", async function () {
        let expectedResult = {
            2008: 2,
            2009: 2,
            2010: 2,
            2017: 3
        };
        const resp = await operations.matchesPerYear(matches)
        expect(resp).to.deep.equal(expectedResult);
    });
    it("should return the matches won by all teams per year", function(done) {
        let expectedResult = {
			"Delhi Daredevils": {
				2017: 1
			},
			"Sunrisers Hyderabad": {
				2015: 1,
				2016: 1
			},
			"Mumbai Indians": {
				2017: 2
			},
			"Kolkata Knight Riders": {
				2016: 1
			},
			"Rising Pune Supergiant": {
				2015: 1
			},
			"Royal Challengers Bangalore": {
				2016: 1
			},
			"Kings XI Punjab": {
				2016: 1,
				2017: 1
			}
		};
        operations.calculateMatchesWonPerYear(matchescsv).then(function(data) {
            try {
                expect(data).to.deep.equal(expectedResult);
                done();
            } catch (e) {
                done(e);
            }

        });

    }); //end of it

    //get Ids commmon method
    it("should return an array of all the team ids", async function () {
        let year = 2017;
        let expectedResult = ['57', '58', '59'];
        const resp = await operations.getMatchID(year, matches)
        expect(resp).to.deep.equal(expectedResult);
    }); //end of it
    //third question 
    it("should return the extra runs conceded per team for 2016", async function () {
        let expectedResult = {
            'Royal Challengers Bangalore': 4
        };
        const resp = await operations.extraRunsPerTeam('2017', matches, deliveries)
        expect(resp).to.deep.equal(expectedResult);
    }); //end of it

    it("should return the top economical bowlers for year 2015", async function () {
        let expectedResult = {
                'TS Mills': 7,
                'A Choudhary': 14.399999999999999
            }
        const resp = await operations.topEconomicalBowlers('2017', matches, deliveries);
        expect(resp).to.deep.equal(expectedResult);
    }); // end of it
    it("should return max runs per over", async function () {
        let expectedResult = {
            'TS Mills': 7,
            'A Choudhary': 12
        };
        const resp = await operations.maxRunsPerOver(deliveries);
        expect(resp).to.deep.equal(expectedResult);
    }); // end of it

}); //end of it