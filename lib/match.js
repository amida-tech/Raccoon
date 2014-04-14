"use strict";

var diff = require("rus-diff").diff;

var lookups = require('./lookups.js');


//Matching Library.
//---------
//This takes the standardized data elements and flags probable duplicates values.


//Basic comparison of two JSON elements for equality
exports.compare = function compare(a, b) {
    //excellent code here
    if (diff(a,b) === false) {
        return {"match": "duplicate"};
    }
    else {
        return {"match": "new"};
    }
};


//Main method, compares new record against master health record and provides matches for all sections
exports.match = function match(new_record, master) {
    var result = { "match" : {}};

    for (var section in lookups.sections) {
        var name = lookups.sections[section];
        //console.log(">>> "+name);

        //if (bb.hasOwnProperty(name)) {
        //    for (var entry in bb.data[name]){
        //        //console.log(bb.data[name][entry]);

        //        expect(match.compare(bb.data[name][entry], bb.data[name][entry])).to.have.property("match", "duplicate");
        //    }
        //}
    }

    return false;
};


// if (el in setObj.elements) ...
var createSet = function() {
  var set = Object.create(null);

  return {
    elements: function() {
      return set;
    },
    add: function(el) {
      set[el]=true;
    },
    delete: function(el) {
        delete set[el];
    }
  };
};

//Support method similar to Python's range
function range(len) {
    var rangeSet = createSet();
    for (var i=0; i<len; i++) {
        rangeSet.add(i);
    }

    return rangeSet;
}

//Generic match of two arrays of entries, using generic compare method
exports.matchSections = function matchSections(new_record, master) {
    //console.log(new_record);
    //console.log(master);

    var result = [];

    var new_entries = range(new_record.length);
    var master_entries = range(master.length);

    for (var i in new_entries.elements()) {
        for (var j in master_entries.elements()) {

            //console.log(i);
            //console.log(j);

            //console.log(new_record[i]);
            //console.log(master[j]);

            //console.log(i+" - "+j);
            var c = this.compare(new_record[i], master[j]);
            //console.log(c.match);
            if (c.match === "duplicate") {
                //assume that new record as well as master record doesn't have duplicates (in itself)
                new_entries.delete(j);
                master_entries.delete(j);
                result.push({"match" : "duplicate", "src_id": i, "dest_id" : j });
                break;

            }
        }

    }

    for (var k in new_entries.elements()) {
        result.push({"match" : "new", "src_id": k});
    }

    return result;
};


