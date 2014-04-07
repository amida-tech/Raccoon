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
        db.connection.on('error', function(err) {
            done(err);
        });
        db.connection.on('connected', function() {
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
        db.putMaster('testuser', input, {}, function(err) {
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
        db.disconnect();
        done();
    });
});
