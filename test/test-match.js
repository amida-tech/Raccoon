var expect = require('chai').expect;

var match = require('../lib/match.js');

describe('match.js test', function () {
    it('does something', function () {
        //expect(true).to.equal(true);
        expect(match.compare({"a":1},{"a":1})).to.be.false;
    });
});



//var should = require('chai').should(),
//    supertest = require('supertest');

