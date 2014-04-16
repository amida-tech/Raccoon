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

// Simplified CCDA model.  Allergies describes what is saved to the
// database and the specification input to the allergies constructor.  
//
// Code           = {code: String, displayName: String}
// Interpretation = [Code],
// Severity       = {value: Code, interpretation: Interpretation} 
// Reaction       = {value: Code, severity: Severity}
// DateRange      = {start: Date, end: Date},
// Allergen       = {code: String, displayName: String, code_system: String}
// Allergy        = {id: [String],
//                  status: String, (code and displayName are the same)
//                  date_range: DateRange,
//                  originalText: String (optional, need more investigation),
//                  allergen: Allergen,
//                  reaction: [Reaction],
//                  severity: Severity}
// Allergies = [Allergy]
//

var tranformCode = function(spec) {
    if (spec) {
        return {
            '@code': spec.code,
            '@displayName': spec.displayName
        };
    } else {
        return null;
    }
};

var tranformCodeArray = function(spec) {
    if (spec) {
        var r = [];
        spec.forEach(function(specElem) {
            var newElem = tranformCode(specElem);
            r.push(newElem);
        });
        return r;
    } else {
        return null;
    }
};

var severity = exports.severity = (function() {
    var tranformSpec = function(spec) {
        return {
            value: transformCode(spec.value),
            interpretationCode: tranformCodeArray(spec.interpretation)
        };
    };

    var p = {};
    p.update = function(value) {
        this.ccda
    };

    var f = function() {
        var r = Object.create(p);
        r.ccda = ccda.allergyIntoleranceObservation();
        return r;
    };
    f.transformSpec = tranformSpec;
    return f;

}());

var allergy = exports.allergy = function() {
    var tranformSpec = function(spec) {
        
    };
    
    var p = {};
    p.defineProperty(p, 'severity', {
        set: function(value) {
            this.ccda.severity = ccda.severityObservation(value);
        },
        get: function() {
            var sev = this.ccda.severity;
            if (sev) {
                var r = severity(sev);
                return r;
            } else {
                return null;
            }
        }
    });
    
    p.getCCDA = function() {
        return ccda;
    };
    
    p.getPersistable = function() {
        var r = {};
        var sev = this.ccda.severity;
        r.severity = severity(sev).getPersistable();
        return r;
    };
    
    var f = function() {
        var r = Object.create(p);
        r.ccda = ccda.allergyIntoleranceObservation();
        return r;
    };
    f.transformSpec = tranformSpec;
    return f;
}();


var allergies = exports.allergies = (function() {
    var transformSpec = function(spec) {
        if (spec) {
            var r = [];
            spec.forEach(function(specElem) {
                specElem = allergy.tranformSpec(specElem);
                var newElem = [{observation: specElem}];
                r.push(newElem);
            });
            return r;
        } else {
            return null;
        }
    };

    var getAllergy = function(ccda, index) {
        if (ccda) {
            var e = ccda.entry.elementAt[index];
            if (e) {
                var a = e.entryRelationship[0];
                if (a && a.observation) {
                    return allergy(a.observation, {ccda: true});
                }
            }
        }
        return null;
    }
    
    var f = function(spec, options) {
        var ccda = null;
        if (options && option.ccda) {
            ccda = spec;
        } else {}
            spec = transformSpec(spec);
            ccda = ccdaImpl.allergiesSection(spec);
        }
        
        var r = Object.create(p);
        r.getCCDA = function() {
            return ccda;
        };
        r.getPersistable = function() {
            var r = [];
            var n = ccda.length;
            if (n > 0) {
                
            }
            return r;
        }
        
        
    };
    return f;
}());

