/*=======================================================================
Copyright 2014 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

// See the test xml ccda2model files for more description of the individual cases.

var expect = require('chai').expect;
var fs = require('fs');

var BlueButton = require('../lib/bluebutton.min.js');

var readBBFile = function(filePath) {
    var xml = fs.readFileSync(filePath, 'utf-8');
    var bb = new BlueButton(xml);
    return bb;
};

describe('ccda to models logic', function() {
    describe('xml', function() {
        var allergies_nodecl = null;
        
        before(function(done) {
            var bb = readBBFile('test/records/ccda2model/allergy_noxmldecl.xml');
            allergies_nodecl = bb.allergies();
            done();
        });

        it('declaration missing bug', function(done) {  // compare to allergy.xml
            expect(allergies_nodecl).to.have.length.above(0);
            var allergy = allergies_nodecl[0];
            expect(allergy.name).to.equal(null);
            expect(allergy.code_system).to.equal(null);
            expect(allergy.code_system_name).to.equal(null);
            done();
        });
    });
    
    describe('allergies', function() {
        describe('allergen name et all (participant)', function() {
            var allergies = null;
            
            before(function(done) {
                var bb = readBBFile('test/records/ccda2model/allergy.xml');
                allergies = bb.allergies();
                done();
            });

            it('all exists', function(done) {
                expect(allergies).to.have.length.above(0);
                var allergy = allergies[0];
                expect(allergy.code).to.equal('314422');
                expect(allergy.name).to.equal('ALLERGENIC EXTRACT, PENICILLIN');
                expect(allergy.code_system).to.equal('2.16.840.1.113883.6.88');
                expect(allergy.code_system_name).to.equal('RxNorm');
                done();
            });
            
            it('null flavor code or no participant', function(done) {
                expect(allergies).to.have.length.above(2);
                for (var i=1; i<3; ++i) {
                    var allergy = allergies[i];
                    expect(allergy.code).to.equal(null);
                    expect(allergy.name).to.equal(null);
                    expect(allergy.code_system).to.equal(null);
                    expect(allergy.code_system_name).to.equal(null);
                }
                done();
            });
        });
        
        describe('date_range (effectiveTime)', function() {
            var allergies = null;
            
            before(function(done) {
                var bb = readBBFile('test/records/ccda2model/allergyDateRange.xml');
                allergies = bb.allergies();
                done();
            });
            
            it('value, low, and high exist', function(done) {
                expect(allergies).to.have.length.above(0);
                var allergy = allergies[0];
                expect(allergy).to.exist;
                expect(allergy.date_range).to.exist;
                expect(allergy.date_range.start).to.exist;
                expect(allergy.date_range.end).to.exist;
                expect(allergy.date_range.start.valueOf()).to.equal((new Date(2008, 4, 1)).valueOf());
                expect(allergy.date_range.end.valueOf()).to.equal((new Date(2012, 7, 6)).valueOf());
                done();
            });
            
            it('value, low, and high exist, value low different', function(done) {
                expect(allergies).to.have.length.above(1);
                var allergy = allergies[1];
                expect(allergy).to.exist;
                expect(allergy.date_range).to.exist;
                expect(allergy.date_range.start).to.exist;
                expect(allergy.date_range.end).to.exist;
                expect(allergy.date_range.start.valueOf()).to.equal((new Date(2009, 8, 2)).valueOf());
                expect(allergy.date_range.end.valueOf()).to.equal((new Date(2010, 0, 3)).valueOf());
                done();
            });

            it('value only, no low or high', function(done) {
                expect(allergies).to.have.length.above(2);
                var allergy = allergies[2];
                expect(allergy).to.exist;
                expect(allergy.date_range).to.exist;
                expect(allergy.date_range.start).to.exist;
                expect(allergy.date_range.end).to.exist;
                expect(allergy.date_range.start.valueOf()).to.equal((new Date(2007, 4, 1)).valueOf());
                expect(allergy.date_range.end.valueOf()).to.equal((new Date(2007, 4, 1)).valueOf());
                done();
            });
            
            it('low, no or nullFlavor high, no value', function(done) {
                expect(allergies).to.have.length.above(4);
                for (var i=3; i<5; ++i) {
                    var allergy = allergies[i];
                    expect(allergy).to.exist;
                    expect(allergy.date_range).to.exist;
                    expect(allergy.date_range.start).to.exist;
                    
                    expect(allergy.date_range.end).to.be.a('null');
                }
                expect(allergies[3].date_range.start.valueOf()).to.equal((new Date(2009, 0, 8)).valueOf());
                expect(allergies[4].date_range.start.valueOf()).to.equal((new Date(1998, 0, 10)).valueOf());
                done();
            });        

            it('low nullFlavor, no or nullFlavor high, no value', function(done) {
                expect(allergies).to.have.length.above(7);
                for (var i=5; i<8; ++i) {
                    var allergy = allergies[i];
                    expect(allergy).to.exist;
                    expect(allergy.date_range).to.exist;
                    expect(allergy.date_range.start).to.be.a('null');
                    expect(allergy.date_range.end).to.be.a('null');
                }
                done();
            });
        });
    });
    
    describe('severity', function() {
        var allergies = null;
        
        before(function(done) {
            var bb = readBBFile('test/records/ccda2model/allergySeverity.xml');
            allergies = bb.allergies();
            done();
        });
        
        it('on reaction and main body, different', function(done) {
            expect(allergies).to.have.length.above(0);
            var allergy = allergies[0];
            expect(allergy).to.exist;
            expect(allergy.severity).to.equal('Mild');
            done();
        });
        
        it('no severity', function(done) {
            expect(allergies).to.have.length.above(1);
            var allergy = allergies[1];
            expect(allergy).to.exist;
            expect(allergy.severity).to.equal(null);
            done();
        });
        
        it('severity from main body, no reaction severity', function(done) {
            expect(allergies).to.have.length.above(2);
            var allergy = allergies[2];
            expect(allergy).to.exist;
            expect(allergy.severity).to.equal('Moderate to severe');
            done();
        });
   });
});
