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
// Code      = {code: String, displayName: String}
// Severity  = {value: Code, interpretation: Code} 
// Reaction  = {value: Code, severity: Severity}
// DateRange = {start: Date, end: Date},
// Allergen  = {code: String, displayName: String, code_system: String}
// Allergy   = {id: [String],
//             status: String, (code and displayName are the same)
//             date_range: DateRange,
//             originalText: String (optional, need more investigation),
//             allergen: Allergen,
//             reaction: [Reaction],
//             severity: Severity
// Allergies = [Allergy]
//

var severity = function() {
    var p = {};
    p.update = function(value) {
        this.ccda
    };


}();

exports.allergy = function() {
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
    return f;
}();


exports.allergies = (function() {
    var p = {
       transformSpec: function(spec) {
           if (spec) {
               var r = [];
               spec.forEach(function(specElem) {
                   var newElem = [{observation: specElem}];
                   r.push(newElem);
               });
               return r;
           } else {
               return null;
           }
       },
       
       getCCDA: function() {
           return this.ccda;
       }
    };
    
    
    
    
    var f = function(spec) {
        spec = transformSpec(spec);
        var ccda = ccdaImpl.allergiesSection(spec);
        
        var r = Object.create(p);
        r.getCCDA = function() {
            return ccda;
        };
        r.getPersistable = function() {
            var n = ccda.length;
        }
        
        
    };
    return f;
}());

