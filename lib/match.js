"use strict";

var diff = require("rus-diff").diff;


//Matching Library.
//---------
//This takes the standardized data elements and flags probable duplicates values.

exports.compare = function compare(a, b) {
    //excellent code here

    return diff(a,b);
};

