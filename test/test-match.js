var expect = require('chai').expect;

var fs = require('fs');
var BlueButton = require('../lib/bluebutton.min.js');

var match = require('../lib/match.js');
var lookups = require('../lib/lookups.js');

var bb;
var bb2;

before(function(done) {
    var xml = fs.readFileSync('test/records/ccda/CCD.sample.xml', 'utf-8');
    bb = new BlueButton(xml);
    var xml2 = fs.readFileSync('test/records/ccda/kinsights-sample-timmy.xml', 'utf-8');
    bb2 = new BlueButton(xml2);
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

    it('testing compare method with BB.js data (Kinsights)', function () {
        //expect(true).to.equal(true);

        for (var section in lookups.sections) {
            var name = lookups.sections[section];
            //console.log(">>> "+name);

            if (bb2.hasOwnProperty(name)) {
                for (var entry in bb2.data[name]){
                    //console.log(bb2.data[name][entry]);

                    expect(match.compare(bb2.data[name][entry], bb2.data[name][entry])).to.have.property("match", "duplicate");
                }
            }
        }

    });


    it('testing matchSections method with two different BB.js data files', function () {

        for (var section in lookups.sections) {
            var name = lookups.sections[section];
            //console.log(">>> "+name);

            if (bb.hasOwnProperty(name) && bb2.hasOwnProperty(name)) {

                    var m = match.matchSections(bb.data[name], bb2.data[name]);

                    for (var item in m) {
                        expect(m[item].match).to.equal("new");
                        expect(m[item]).to.have.property('src_id');
                        expect(m[item]).to.not.have.property('dest_id');
                    }
            }
        }

    });


    it('testing matchSections method with two same BB.js data files', function () {

        for (var section in lookups.sections) {
            var name = lookups.sections[section];
            //console.log(">>> "+name);

            if (bb.hasOwnProperty(name) && bb.hasOwnProperty(name)) {

                    var m = match.matchSections(bb.data[name], bb.data[name]);

                    for (var item in m) {
                        expect(m[item].match).to.equal("duplicate");
                        expect(m[item]).to.have.property('src_id');
                        expect(m[item]).to.have.property('dest_id');
                    }
            }
        }

    });


    describe('allergy sections comparison', function () {
        it('testing matchSections method on two equal allergy sections', function () {
            //console.log(match.matchSections(bb.data["allergies"],bb.data["allergies"]));
            var m = match.matchSections(bb.data["allergies"],bb.data["allergies"]);

            for (var item in m) {
                expect(m[item].match).to.equal("duplicate");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });
    });


    describe('full record comparison', function () {
        it('testing match method', function () {
            expect(match.match(bb,bb)).to.be.ok;
            expect(match.match(bb,bb2)).to.be.ok;
        });
    });

});
