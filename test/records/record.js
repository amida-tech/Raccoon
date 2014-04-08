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

var should = require('should');
var db = require('../../lib/record');
db.logger.level = 'debug';

describe('Basic Test', function() {
    before(function(done) {
        db.once('error', function(err) {
            done(err);
        });
        db.once('connected', function() {
            done();
        });

        db.connect();
    });
    
    it('Put/Get Master Demographics/Allergies', function(done) {
        var input = Object.create(null);
        var inputDemo = input['demographics'] = Object.create(null);
        inputDemo.data = {section: 'demographics', testkey: {demokey: 'demodata'}};
        inputDemo.metadata = {metadone: 'metadone', metadtwo: 'metadtwo'};
        var inputAlle = input['allergies'] = Object.create(null);
        inputAlle.data = {section: 'allergies', testkey: {allekey: 'alledata'}};
        inputAlle.metadata = {metaaone: 'metaaone', metaatwo: 'metaatwo'};
        db.putMaster('testuser', input, null, function(err) {
            if (err) {
                done(err);
            } else {
                db.getMaster("testuser", null, function(err, output) {
                    if (err) {
                        done(err);
                    } else {
                        should(output).have.property('demographics');
                        should(output).have.property('allergies');
                        outDemo = output['demographics'];
                        outAlle = output['allergies'];
                        should(outDemo).have.property('data');
                        should(outDemo).have.property('metadata');
                        should(outDemo.data).have.property('section', 'demographics');
                        should(outDemo.metadata).have.property('metadone', 'metadone');
                        should(outDemo.metadata).have.property('metadtwo', 'metadtwo');
                        done();
                    }
                });
            }
        });
    });
    
    after(function(done) {
        db.disconnect(function() {
            done();
        });
    });
});

describe('Section Methods', function() {
    var testOwner = 'testowner';
    
    before(function(done) {
        db.once('error', function(err) {
            done(err);
        });
        db.once('connected', function() {
            db.dropAll(function(err, result) {
                if (err) {
                    done(err);
                } else {
                    var inputRecord = {
                        'dummysectionfull': {
                            data: 'expldatafull',
                            metadata: 'explmetadatafull'
                        },
                        'dummysectionremove': {
                            data: 'expldataremove',
                            metadata: 'explmetadataremove'
                        }
                    };
                    
                    db.putMaster(testOwner, inputRecord, null, function(err) {
                        done(err);
                    });
                }
            });
        });
        
        var options = {
            ownerTitle: 'testowner',
            sectionTitles: ['dummysectionadd', 'dummysectionremove', 'dummysectionnull', 'dummysectionfull']
        };
        db.connect(null, options);
    });
    
    describe('Add Section Data', function() {
        it('Verify Empty', function(done) {
            db.getDummysectionadd(testOwner, function(err, result) {
                should.not.exist(err);
                should.not.exist(result);
                done();
            });
        });
        
        it('Add Invalid', function(done) {
            db.putDummysectionadd(testOwner, "invalid data", function(err) {
                should.exist(err);
                done();
            });
        });
        
        it('Add Valid', function(done) {
            inputRecord = {
                data: 'expldataadd',
                metadata: 'explmetadataadd'
            };
            db.putDummysectionadd(testOwner, inputRecord, function(err) {
                should.not.exist(err);
                done();
            });
        });
        
       it('Verify Valid', function(done) {
            db.getDummysectionadd(testOwner, function(err, result) {
                should.not.exist(err);
                should.exist(result);
                should(result).have.property('data', 'expldataadd');
                should(result).have.property('metadata', 'explmetadataadd');
                done();
            });
       });
       
       it('Verify Existing', function(done) {
           db.getDummysectionfull(testOwner, function(err, result) {
               should.not.exist(err);
               should.exist(result);
               should(result).have.property('data', 'expldatafull');
               should(result).have.property('metadata', 'explmetadatafull');
               done();
           });
       });
       
       it('Verify Existing Null', function(done) {
           db.getDummysectionnull(testOwner, function(err, result) {
               should.not.exist(err);
               should.not.exist(result);
               done();
           });
       });
    });
    
    describe('Remove Section Data', function() {
        it('Verify Not Empty', function(done) {
            db.getDummysectionremove(testOwner, function(err, result) {
                should.not.exist(err);
                should.exist(result);
                should(result).have.property('data', 'expldataremove');
                should(result).have.property('metadata', 'explmetadataremove');
                done();
            });
        });
        
        it('Remove', function(done) {
            db.putDummysectionremove(testOwner, null, function(err) {
                should.not.exist(err);
                done();
            });
        });
        
       it('Verify Removed', function(done) {
            db.getDummysectionremove(testOwner, function(err, result) {
                should.not.exist(err);
                should.not.exist(result);
                done();
            });
       });
       
       it('Verify Existing', function(done) {
           db.getDummysectionfull(testOwner, function(err, result) {
               should.not.exist(err);
               should.exist(result);
               should(result).have.property('data', 'expldatafull');
               should(result).have.property('metadata', 'explmetadatafull');
               done();
           });
       });
       
       it('Verify Existing Null', function(done) {
           db.getDummysectionnull(testOwner, function(err, result) {
               should.not.exist(err);
               should.not.exist(result);
               done();
           });
       });
    });
    
    after(function(done) {
        db.dropAll(function(err0, result) {
            db.disconnect(function(err1) {
                done(err0 || err1);
            });
        });
    });    
});
