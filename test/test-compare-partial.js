/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

var expect = require('chai').expect;

var fs = require('fs');
var BlueButton = require('../lib/bluebutton.min.js');

var compare = require('../lib/match/compare-partial.js').compare;
var lookups = require('../lib/lookups.js');

var bb;
var bb2;

before(function(done) {
    var xml = fs.readFileSync('test/records/ccda/CCD_demo1.xml', 'utf-8');
    bb = new BlueButton(xml);
    var xml2 = fs.readFileSync('test/records/ccda/CCD_demo2.xml', 'utf-8');
    bb2 = new BlueButton(xml2);
    var xml3 = fs.readFileSync('test/records/ccda/CCD_demo3.xml', 'utf-8');
    bb3 = new BlueButton(xml3);

    var xml4 = fs.readFileSync('test/records/ccda/kinsights-sample-timmy.xml', 'utf-8');
    bb4 = new BlueButton(xml4);

    //console.log(bb.data);
    done();
});


describe('Matching library (compare-partial.js) tests', function () {

    describe('Entries level tests', function () {
        it('testing compare method', function () {

            expect(compare("none")({"a":1},{"a":1})).to.have.property("match", "duplicate");
            expect(compare("none")({"a":1},{"a":2})).to.have.property("match", "new");

            //check that order doesnt matter
            expect(compare("none")({"a":1, "b": 2},{"b":2, "a":1})).to.have.property("match", "duplicate");

        });

        it('testing compare method with BB.js data', function () {
            //expect(true).to.equal(true);

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {
                    for (var entry in bb.data[name]){
                        //console.log(bb.data[name][entry]);

                        expect(compare(name)(bb.data[name][entry], bb.data[name][entry])).to.have.property("match", "duplicate");
                    }
                }
            }

        });
        it('testing compare method with BB.js data', function () {
            //expect(true).to.equal(true);

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {
                    for (var entry in bb2.data[name]){
                        //console.log(bb.data[name][entry]);

                        expect(compare(name)(bb2.data[name][entry], bb2.data[name][entry])).to.have.property("match", "duplicate");
                    }
                }
            }

        });
        it('testing compare method with BB.js data', function () {
            //expect(true).to.equal(true);

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {
                    for (var entry in bb3.data[name]){
                        //console.log(bb.data[name][entry]);

                        expect(compare(name)(bb3.data[name][entry], bb3.data[name][entry])).to.have.property("match", "duplicate");
                    }
                }
            }

        });

        it('testing compare method with BB.js data (Kinsights)', function () {
            //expect(true).to.equal(true);

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb2.hasOwnProperty(name)) {
                    for (var entry in bb2.data[name]){
                        //console.log(bb2.data[name][entry]);

                        expect(compare(name)(bb2.data[name][entry], bb2.data[name][entry])).to.have.property("match", "duplicate");
                    }
                }
            }

        });



    });

});
