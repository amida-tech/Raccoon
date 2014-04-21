/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

var expect = require('chai').expect;

var fs = require('fs');
var BlueButton = require('../lib/bluebutton.min.js');

var Match = require('../lib/match.js');
var compare = require('../lib/match/compare-partial.js').compare;
var lookups = require('../lib/lookups.js');
var equal = require('deep-equal');

var matchSections = new Match(compare).matchSections;

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


describe('Matching library (match-sections.js) tests', function () {



    describe('Sections level tests', function () {

        it('testing matchSections method with two different BB.js data files', function () {

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name) && bb4.hasOwnProperty(name)) {

                        var m = matchSections(bb.data[name], bb4.data[name], compare(name));

                        for (var item in m) {
                            //console.log(m[item].match);
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

                if (bb4.hasOwnProperty(name) && bb4.hasOwnProperty(name)) {

                        var m = matchSections(bb4.data[name], bb4.data[name], compare(name));

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
                var m = matchSections(bb.data["allergies"],bb.data["allergies"], compare("allergies"));

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
            var m = matchSections(bb3.data["allergies"], bb.data["allergies"], compare("allergies"));
            //console.log("match bb3 to bb2");
            var m2 = matchSections(bb3.data["allergies"], bb2.data["allergies"], compare("allergies"));

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
                  { match: 'duplicate', src_id: '1', dest_id: '1' },
                  { match: 'duplicate', src_id: '3', dest_id: '2' },
                  { match: 'new', src_id: '2' },
                  { match: 'new', src_id: '4' } ];
            var mr2=[ { match: 'duplicate', src_id: '0', dest_id: '0' },
                  { match: 'duplicate', src_id: '1', dest_id: '1' },
                  { match: 'duplicate', src_id: '3', dest_id: '3' },
                  { match: 'new', src_id: '2' },
                  { match: 'new', src_id: '4' } ];

            //sorting arrays by src_id since order matters...
            expect(m.sort(src_sort)).to.deep.equal(mr.sort(src_sort));
            expect(m2.sort(src_sort)).to.deep.equal(mr2.sort(src_sort));
        });

    });




});
