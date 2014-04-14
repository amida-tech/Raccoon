var expect = require('chai').expect;

var fs = require('fs');
var BlueButton = require('../lib/bluebutton.min.js');

var match = require('../lib/match.js');
var lookups = require('../lib/lookups.js');

var bb;

before(function(done) {
    var xml = fs.readFileSync('test/records/ccda/CCD.sample.xml', 'utf-8');
    bb = new BlueButton(xml);
    //console.log(bb.data);
    done();
});


describe('match.js test', function () {
    it('testing compare method', function () {
        //expect(true).to.equal(true);
        expect(match.compare({"a":1},{"a":1})).to.have.property("match", "duplicate");
        expect(match.compare({"a":1},{"a":2})).to.have.property("match", "new");
    });

    it('testing compare method with BB.js data', function () {
        //expect(true).to.equal(true);

        for (var section in lookups.sections) {
            var name = lookups.sections[section];
            //console.log(">>> "+name);

            if (bb.hasOwnProperty(name)) {
                for (var entry in bb.data[name]){
                    //console.log(bb.data[name][entry]);

                    expect(match.compare(bb.data[name][entry], bb.data[name][entry])).to.have.property("match", "duplicate");
                }
            }
        }

    });


    describe('full record comparison', function () {
        it('testing match method', function () {
            expect(true).to.equal(true);
        });
    });

});
