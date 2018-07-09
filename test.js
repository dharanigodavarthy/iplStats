/*jshint esversion: 6 */
const expect = require("chai").expect;
const path = require('path');
const matches = path.resolve("ipl/matches_test.csv");
const deliveries = path.resolve("ipl/deliveries_test.csv");
const fileName = path.resolve("iplStats.js");
const operations = require(fileName);

describe('operations', function () {
    it("should return the number of matches per year", function (done) {
        let expectedResult = {
            2017: 3,
            2008: 2,
            2009: 2,
            2010: 2
        };
        operations.matchesPerYear(matches).then(function (data) {
            try {
                expect(data).to.deep.equal(expectedResult);
                done(); // success: call done with no parameter to indicate that it() is done()
            } catch (e) {
                done(e); // failure: call done with an error Object to indicate that it() failed
            }
        });

    }); //end of it
});