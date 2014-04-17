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
var _ = require('underscore');
var allergiesModel = require('../models/allergies');
var expect = require('chai').expect;

var fs = require('fs');
var BlueButton = require('../lib/bluebutton.min.js');

var readBBFile = function(filePath) {
    var xml = fs.readFileSync('test/records/ccda/CCD.sample.xml', 'utf-8');
    var bb = new BlueButton(xml);
    return bb;
};

var getDeepProperties = function(obj, root) {
    var result = [];
    Object.keys(obj).forEach(function(key) {
        var value = root ? root + '.' + key : key;
        result.push(value);
        if (obj[key] && typeof obj[key] === 'object') {
            var subResult = getDeepProperties(obj[key], value);
            result = result.concat(subResult);
        }
    });
    return result;
};

describe('bluebutton.js', function () {
    it ('helper method sanity check', function(done) {
        var a = {prop1: 1, prop2: {x:2, y:3}};
        props = getDeepProperties(a);
        expect(props).to.have.length(4);
        props.forEach(function(prop) {
            expect(a).to.have.deep.property(prop);
        });
        expect(a).to.have.deep.property('prop1');
        expect(a).not.to.have.deep.property('x');
        done();
    });
    
    it('demographics exists', function () {
        var xml = fs.readFileSync('test/records/ccda/CCD.sample.xml', 'utf-8');
        var bb = new BlueButton(xml);

        // Log demographics JSON object
        //console.log(bb.allergies().json());

        expect(bb.demographics()).to.be.ok;
    });
    
    describe('allergies', function() {
        describe('CCD_demo1.xml', function() {
            var allergies = null;

            before(function(done) {
                bb = readBBFile('test/records/ccda/CCD_demo1.xml');
                allergies = bb.allergies();
                done();
            });

            it('expected properties', function(done) {
                expect(allergies).to.have.length(3);
                schema = allergiesModel.schema;
                schemaClone = _.clone(schema);
                delete schemaClone.metadata;
                schemaProps = getDeepProperties(schemaClone);
                expect(schemaProps).to.have.length.above(0);
                allergies.forEach(function(allergy) {
                    schemaProps.forEach(function(schemaProp) {
                        expect(allergy).to.have.deep.property(schemaProp);
                    });
                    props = getDeepProperties(allergy);
                    props.forEach(function(prop) {
                        expect(schema).to.have.deep.property(prop);
                    });
                    // sanity
                    expect(allergy).not.to.have.property('xxxxx');
                    expect(allergy).not.to.have.deep.property('reaction.xxxx');
                });
                done();
            });

            it('no nulls', function(done) {
                expect(allergies).to.have.length(3);
                allergies.forEach(function(allergy) {
                    props = getDeepProperties(allergy);
                    props.forEach(function(prop) {
                        expect(allergy).to.have.deep.property(prop).that.exist;
                    });
                });
                done();
            });
        });
    });
});