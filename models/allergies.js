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

var schema = require('mongoose');

var Severity = exports.Severity = new scheam.Schema({
    value: String,         // 2.16.840.1.113883.3.88.12.3221.6.8
    interpretion: String   // 2.16.840.1.113883.1.11.78
});

var Reaction = exports.Reaction = new schema.Schema({
    value: String,         // 2.16.840.1.113883.3.88.12.3221.7.4
    severity: Severity
});

exports.allergySchema = new schema.Schema({
    id: [String],
    status: String, // needs to be abstracted to ValueSet (statusCode 2.16.840.1138883.11.20.9.19)
    date_range: {
        start: Date,
        end: Date
    },
    // Rest is observation template which in theory can be array per act but not recommended
    code: String,   // name, code sytem and code_system_name are constants 2.16.840.1.113883.3.88.12.32 21.6.2
    originalText: String,
    allergen: {
        code: String,
        code_system: String
    },
    // status: String,  meaningless      // 2.16.840.1.113883.3.88.12.80.68
    reaction: Reaction,
    severity: Severity
});

var observationInterpretation = function() {
    var p = {
        '@codeSystem': '2.16.840.1.113883.1.11.78',
        '@codeSystemName': 'Observation Interpretation',
        
        checkIntegrity: function() {
            return this['@code'] && this['@displayName'] ? true : false;
        }
    };
    Object.freeze(p);
    
    var f = function(spec) {
        var r = Object.create(p);
        r['@code'] = spec['@code'] || spec.code;
        r['@displayName'] = spec['@displayName'] || spec.displayName;
        Object.preventExtensions(r);
        return r;
    };
    return f;
}();

var observationInterpretationArray = function() {
    var p = {
        push: function(spec) {
            var e = observationInterpretation(spec);
            var n = this.array.push(e);
            this.defineProperty(this, n, {
                get: function() {
                    return this.array[n];
                },
                set: function(spec) {
                    this.array[n] = observationInterpretation(spec);
                }
            });
        },
        length: function() {
            return this.array.length;
        },
        checkIntegrity: function() {
            int n = this.array.length;
            if (n >= this.minLen) {
                for (var i=0; i<n; ++i) {
                    if (! this.array.checkIntegrity()) {
                        return false;
                    };
                }
                return true;
            } else {
                return false;
            }
        },
        minLen: 0,
    };
    
    var f = function() {
        var r = Object.create(p);
        r.array = [];
        Object.freeze(r);
        return r;
    };
    return f;
}();

var severityObservationValue = function() {
    var p = {
        '@xsi:type': 'CD',
        '@codeSystem': '2.16.840.1.113883.6.96',
        '@codeSystemName': 'SNOMED CT',
        checkIntegrity: function() {
            return this['@code'] && this['@displayName'] ? true : false;
        }
    };
    Object.freeze(p);
    
    var f = function(spec) {
        var r = Object.create(p);
        r['@code'] = spec['@code'] || spec.code;
        r['@displayName'] = spec['@displayName'] || spec.displayName;
        Object.preventExtensions(r);
        return r;
    };
    return f;
}();

var severityObservation = function() {
    var p = {
        '@classCode': 'OBS',
        '@moodCode': 'EVN',
        templateId: {
            '@root': '2.16.840.1.113883.10.20.22.4.8'
        },
        code: {
            '@code': 'SEV',
            '@displayName': 'Severity Observation',
            '@codeSystem': '2.16.840.1.113883.5.4',
            '@codeSystemName': 'ActCode'
        },
        statusCode: {
            '@code': 'completed',
            '@displayName': 'Status Code',
            '@codeSystem': '2.16.840.1.113883.5.14',
            '@codeSystemName': 'ActStatus'
        }
    };
    Object.freeze(p);
    Object.freeze(p.templateId);
    Object.freeze(p.code);
    Object.freeze(p.statusCode);
    
    var f = function() {
        var r = Object.create(p);
        r.text = {
            reference: {
                '@value': null
            }
        };
        Object.preventExtensions(r.text);
        Object.preventExtensions(r.text.reference);
        r.value = severityObservationValue();
        r.interpretationCode = observationInterpretationArray();
        Object.preventExtensions(r);
        return r;
    };
    return f;
}();

var allergyIntoleranceObservation = function() {
    var p = {
        '@classCode': 'OBS',
        '@moodCode': 'EVN',
        templateId: {
            '@root': '2.16.840.1.113883.10.20.22.4.7'
        }
    };
    Object.freeze(p);
    Object.freeze(p.templateId);
    
    var f = function() {
        var r = Object.create(p);
        r.severity = severityObservation();
        Object.preventExtensions(r);
        return r;
    }
    return f;
}();


