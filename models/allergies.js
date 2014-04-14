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
