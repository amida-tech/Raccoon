var expect = require('chai').expect;

var fs = require('fs');
var BlueButton = require('../lib/bluebutton.min.js');


describe('bluebutton.js test', function () {
    it('does something', function () {
		var xml = fs.readFileSync('test/records/ccda/CCD.sample.xml', 'utf-8');
		var bb = new BlueButton(xml);

		// Log demographics JSON object
		//console.log(bb.allergies().json());

        expect(bb.demographics()).to.be.ok;
    });
});