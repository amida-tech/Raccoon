/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

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
    var xml3 = fs.readFileSync('test/records/ccda/mix_and_match.xml', 'utf-8');
    bb3 = new BlueButton(xml3);
    //console.log(bb.data);
    done();
});


describe('Matching library (match.js) tests', function () {

    describe('Entries level tests', function () {
        it('testing compare method', function () {
            //expect(true).to.equal(true);
            expect(match.compare({"a":1},{"a":1})).to.have.property("match", "duplicate");
            expect(match.compare({"a":1},{"a":2})).to.have.property("match", "new");

            //check that order doesnt matter
            expect(match.compare({"a":1, "b": 2},{"b":2, "a":1})).to.have.property("match", "duplicate");

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



    });

    describe('Sections level tests', function () {

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

        //TODO: this test relies on details of sample files, had to be rewritten if samples change
        it('allergy section comparison of documents with mix and match', function () {
            //console.log("match bb3 to bb");
            var m = match.matchSections(bb3.data["allergies"], bb.data["allergies"]);
            //console.log("match bb3 to bb2");
            var m2 = match.matchSections(bb3.data["allergies"], bb2.data["allergies"]);

            expect(m).to.be.ok;
            expect(m2).to.be.ok;

            //console.log(m);
            //console.log(m2);


            //basic sorting function for later
            function src_sort(a,b) {
              if (a.src_id < b.src_id) {
                 return -1;
             }
              if (a.src_id > b.src_id) {
                return 1;
                }
              return 0;
            }

            var mr=[ { match: 'duplicate', src_id: '0', dest_id: '0' },
                      { match: 'duplicate', src_id: '2', dest_id: '2' },
                      { match: 'duplicate', src_id: '1', dest_id: '1' },
                      { match: 'new', src_id: '3' } ];
            var mr2=[ { match: 'duplicate', src_id: '3', dest_id: '0' },
                      { match: 'new', src_id: '1' },
                      { match: 'new', src_id: '0' },
                      { match: 'new', src_id: '2' } ];

            //sorting arrays by src_id since order matters...
            expect(m.sort(src_sort)).to.deep.equal(mr.sort(src_sort));
            expect(m2.sort(src_sort)).to.deep.equal(mr2.sort(src_sort));
        });

    });


    describe('Header level tests', function () {

        xit('some sophisticated header tests will be added there later', function() {});
    });

    describe('Document level tests', function () {

        it('full record comparison of same document', function () {
            var m = match.match(bb,bb);

            expect(m).to.be.ok;
            expect(m).to.have.property("match");

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {

                    expect(m["match"]).to.have.property(name);

                        for (var item in m["match"][name]) {
                            expect(m["match"][name][item].match).to.equal("duplicate");
                            expect(m["match"][name][item]).to.have.property('src_id');
                            expect(m["match"][name][item]).to.have.property('dest_id');
                        }
                }
            }

        });


        it('full record comparison of two differnt documents', function () {
            var m = match.match(bb,bb2);

            expect(m).to.be.ok;
            expect(m).to.have.property("match");

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {

                    expect(m["match"]).to.have.property(name);

                        for (var item in m["match"][name]) {
                            expect(m["match"][name][item].match).to.equal("new");
                            expect(m["match"][name][item]).to.have.property('src_id');
                            expect(m["match"][name][item]).to.have.not.property('dest_id');
                        }
                }
            }
        });


    });


});
