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
var db = require('../lib/record');
// db.logger.level = 'debug';

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
            var inputRecord = {
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

describe('Master Methods Add/Remove Seperate', function() {
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
                        'dummysectionremove1': {
                            data: 'expldataremove1',
                            metadata: 'explmetadataremove1'
                        },
                        'dummysectionremove2': {
                            data: 'expldataremove2',
                            metadata: 'explmetadataremove2'
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
            sectionTitles: ['dummysectionadd1', 'dummysectionadd2', 'dummysectionremove1', 'dummysectionremove2', 'dummysectionnull', 'dummysectionfull']
        };
        db.connect(null, options);
    });
    
    describe('Add', function() {
        it('Verify Empty', function(done) {
            db.getMaster(testOwner, null, function(err, result) {
                should.not.exist(err);
                should.exist(result);
                should.not.exist(result.dummysectionadd1);
                should.not.exist(result.dummysectionadd2);
                done();
            });
        });
        
        it('Add Invalid', function(done) {
            db.putMaster(testOwner, "invalid data", null, function(err) {
                should.exist(err);
                done();
            });
        });
        
        it('Add Valid', function(done) {
            var inputRecord = {
                dummysectionadd1: {
                    data: 'expldataadd1',
                    metadata: 'explmetadataadd1'
                },
                dummysectionadd2: {
                    data: 'expldataadd2',
                    metadata: 'explmetadataadd2'
                }
            };
            db.putMaster(testOwner, inputRecord, null, function(err) {
                should.not.exist(err);
                done();
            });
        });
        
        it('Verify All', function(done) {
            var options = {sections: ['dummysectionadd1', 'dummysectionadd2', 'dummysectionfull', 'dummysectionnull']};
            db.getMaster(testOwner, options, function(err, result) {
                should.not.exist(err);
                should.exist(result);
                should.exist(result.dummysectionadd1);
                should.exist(result.dummysectionadd2);
                should.exist(result.dummysectionfull);
                should(result).have.property('dummysectionnull');
                should(result.dummysectionadd1).have.property('data', 'expldataadd1');
                should(result.dummysectionadd1).have.property('metadata', 'explmetadataadd1');
                should(result.dummysectionadd2).have.property('data', 'expldataadd2');
                should(result.dummysectionadd2).have.property('metadata', 'explmetadataadd2');
                should(result.dummysectionfull).have.property('data', 'expldatafull');
                should(result.dummysectionfull).have.property('metadata', 'explmetadatafull');
                should.not.exist(result.dummysectionnull);
                done();
            });
       });
    });
    
    describe('Remove', function() {
        it('Verify Exists', function(done) {
            db.getMaster(testOwner, null, function(err, result) {
                should.not.exist(err);
                should.exist(result);
                should.exist(result.dummysectionremove1);
                should.exist(result.dummysectionremove2);
                done();
            });
        });
        
        it('Remove', function(done) {
            var inputRecord = {
                dummysectionremove1: null,
                dummysectionremove2: null
            };
            db.putMaster(testOwner, inputRecord, null, function(err) {
                should.not.exist(err);
                done();
            });
        });
        
        it('Verify All', function(done) {
            var options = {sections: ['dummysectionremove1', 'dummysectionremove2', 'dummysectionfull', 'dummysectionnull']};
            db.getMaster(testOwner, options, function(err, result) {
                should.not.exist(err);
                should.exist(result);
                should(result).have.property('dummysectionremove1');
                should(result).have.property('dummysectionremove2');
                should.not.exist(result.dummysectionadd1);
                should.not.exist(result.dummysectionadd2);
                should.exist(result.dummysectionfull);
                should(result).have.property('dummysectionnull');
                should.not.exist(result.dummysectionremove1);
                should.not.exist(result.dummysectionremove2);
                should(result.dummysectionfull).have.property('data', 'expldatafull');
                should(result.dummysectionfull).have.property('metadata', 'explmetadatafull');
                should.not.exist(result.dummysectionnull);
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

describe('Master Methods Add/Remove Together', function() {
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
                        'dummysectionremove1': {
                            data: 'expldataremove1',
                            metadata: 'explmetadataremove1'
                        },
                        'dummysectionremove2': {
                            data: 'expldataremove2',
                            metadata: 'explmetadataremove2'
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
            sectionTitles: ['dummysectionadd1', 'dummysectionadd2', 'dummysectionremove1', 'dummysectionremove2', 'dummysectionnull', 'dummysectionfull']
        };
        db.connect(null, options);
    });
    
    it('Verify Existing', function(done) {
        db.getMaster(testOwner, null, function(err, result) {
            should.not.exist(err);
            should.exist(result);
            should.not.exist(result.dummysectionadd1);
            should.not.exist(result.dummysectionadd2);
            should.exist(result.dummysectionremove1);
            should.exist(result.dummysectionremove2);
            should(result.dummysectionremove1).have.property('data', 'expldataremove1');
            should(result.dummysectionremove1).have.property('metadata', 'explmetadataremove1');
            should(result.dummysectionremove2).have.property('data', 'expldataremove2');
            should(result.dummysectionremove2).have.property('metadata', 'explmetadataremove2');
            done();
        });
    });
        
    it('Add/Remove', function(done) {
        var inputRecord = {
            dummysectionadd1: {
                data: 'expldataadd1',
                metadata: 'explmetadataadd1'
            },
            dummysectionadd2: {
                data: 'expldataadd2',
                metadata: 'explmetadataadd2'
            },
            dummysectionremove1: null,
            dummysectionremove2: null
        };
        db.putMaster(testOwner, inputRecord, null, function(err) {
            should.not.exist(err);
            done();
        });
    });
        
    it('Verify', function(done) {
        db.getMaster(testOwner, null, function(err, result) {
            should.not.exist(err);
            should.exist(result);
            should.exist(result.dummysectionadd1);
            should.exist(result.dummysectionadd2);
            should.exist(result.dummysectionfull);
            should(result).have.property('dummysectionremove1');
            should(result).have.property('dummysectionremove2');
            should(result).have.property('dummysectionnull');
            should(result.dummysectionadd1).have.property('data', 'expldataadd1');
            should(result.dummysectionadd1).have.property('metadata', 'explmetadataadd1');
            should(result.dummysectionadd2).have.property('data', 'expldataadd2');
            should(result.dummysectionadd2).have.property('metadata', 'explmetadataadd2');
            should(result.dummysectionfull).have.property('data', 'expldatafull');
            should(result.dummysectionfull).have.property('metadata', 'explmetadatafull');
            should.not.exist(result.dummysectionremove1);
            should.not.exist(result.dummysectionremove2);
            should.not.exist(result.dummysectionnull);
            done();
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
