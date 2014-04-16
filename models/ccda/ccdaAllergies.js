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

var jsutil = require('../../lib/jsutil');

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
    jsutil.deepFreeze(p);
    
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

exports.allergyIntoleranceObservation = function() {
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

var allergyProblemActEntryRelationship = (function() {
    var p = {
        '@typeCode': 'SUBJ'
    };
    jsutil.deepFreeze(q);
    
    var f = function(spec) {        
        var observation = null;
        var r = Object.create(p);
        if (spec) {
            observation = allergyIntoleranceObservation(value);
        }
        Object.defineProperty(r, 'observation', {
            get: function() {
                return observation;
            },
            set: function(value) {
                observation = allergyIntoleranceObservation(value);
            }
        });
        return r;
    };
    return f;
    
    
}());

exports.allergyProblemAct = (function() {
    var p = {
        '@classCode': 'ACT',
        '@moodCode': 'EVN',
        templateId: {
            '@root': '2.16.840.1.113883.10.20.22.4.30'
        },
        code: {
            '@code': '48765-2',
            '@displayName': 'Allergies, adverse reactions, alerts',
            '@codeSystem': '2.16.840.1.113883.6.1',
            '@codeSystemName': 'LOINC'
        }
    };
    jsutil.deepFreeze(p);
    
    var f = function(spec) {
        var r = Object.create(p);
        jsutil.defineCheckedArrayProperty(r, 'entryRelationship', allergyProblemActEntryRelationship, 1);
        return r;
    };
    return f;
}());

exports.allergiesSection = (function() {
    var p = {
        templateId: [{
            '@root': '2.16.840.1.113883.10.20.22.2.6'
        }, {
            '@root': '2.16.840.1.113883.10.20.22.2.6.1'
        }],
        code: {
            '@code': '48765-2',
            '@displayName': 'Allergies, adverse reactions, alerts',
            '@codeSystem': '2.16.840.1.113883.6.1',
            '@codeSystemName': 'LOINC'
        },
        title: 'Allergies'
    };
    jsutil.deepFreeze(p);
    
    var f = function(spec) {
        var r = Object.create(p);
        r.text = 'TBD';
        jsutil.defineCheckedArrayProperty(r, 'entry', allergyProblemAct, 1);
        if (spec) {
            r.entry = spec;
        };
        Object.preventExtensions(r);
        return r;
    };
    return f;
}());
