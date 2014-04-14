var expect = require('chai').expect;
var assert = require('chai').assert;

var lookups = require('../lib/lookups.js');

describe('lookups.js test', function () {
    it('check sections lookup', function () {
        //expect(true).to.equal(true);
        expect(lookups.sections).to.be.ok;
    });

    it('check sections lookup to be array', function () {
        //expect(true).to.equal(true);
        assert.isArray(lookups.sections, "sections lookup is array");
    });

    it('check sections lookup to have 8 elements', function () {
        //expect(true).to.equal(true);
        assert.lengthOf(lookups.sections, 8, "sections lookup has 8 elements");
    });


});


