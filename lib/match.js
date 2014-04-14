"use strict";

var diff = require("rus-diff").diff;


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

    return false;
};