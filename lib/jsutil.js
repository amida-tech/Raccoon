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

exports.deepFreeze = function deepFreeze(obj) {
    Object.freeze(obj);
    var keys = Object.keys(obj);
    keys.forEach(function(key) {
        var p = obj[key];
        if (p && (typeof p === 'object') && ! Object.isFrozen(p)) {
            deepFreeze(p);
        }
    });
};

var checkedArray = exports.checkedArray = (function() {
    var checkArrayIntegrity = function(array, minLength, maxLength) {
        var n = array.length;
        if (maxLength && (n > maxLength)) {
            return {pass: false, msg: 'Too many elements'};
        }
        if (minLength && (n < minLength)) {
            return {pass: false, msg: 'Too few elements'};
        }
        for (var i=0; i<n; ++i) {
            var e = array[i];
            var r = e.checkIntegrity();
            if (r.pass) {
                return r;
            }
        } 
        return {pass: true};
    };
    
    var createArray = function(factory, specArr) {
        var r = [];
        var n = specArr.length;
        for (var i=0; i<n; ++i) {
            var spec = specArr[i];
            var e = factory(spec);
            r.push(e);
        };
        return r;
    };
    
    return function(factory, minLength, maxLength) {
        var data = [];
        var r = {
            push: function(spec) {
                var e = factory(spec);
                return data.push(e);
            },
            length: function() {
                return data.length;
            },
            elementAt: function(index) {
                return data[index];
            },
            checkIntegrity: function() {
                return checkArrayIntegrity(data, minLength, maxLength);
            },
            replace: function(specArr) {
                data = createArray(factory, specArr);
            }
        };
        Object.freeze(r);
        return r;
    };
}());

exports.defineCheckedArrayProperty(obj, name, factory, minLength, maxLength) {
    var prop = checkedArray(factory, minLength, maxLength);
    Object.defineProperty(obj, name, {
        get: function() {
            return prop;
        },
        set: function(value) {
            prop.replace(value);
        }
    });
};
