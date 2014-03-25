/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

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

var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var jsdom = require('jsdom');
var logger = require('winston');
var app = express();
var config = require('./config.js');

var parser = require('./lib/bluebutton.min.js');
var matcher = require('./lib/match.js');
var reviewer = require('./lib/reconciliation.js');
var master = require('./lib/record.js');

app.use(parser);
app.use(matcher);
app.use(reviewer);
app.use(master);

app.set("domain", config.server.url);

// Connect mongoose.
mongoose.connect('mongodb://' + config.database.url + '/'+ config.database.name, function(err) {
    if (err) {
        logger.error('DB Connection Error: ' + err);
        throw err;
    }
});


var server = http.createServer(app);
server.listen(config.server.port);
console.log("Server listening on port "+ config.server.port);


/*
//This is code used to override the need of a second database.
var db_settings = {database: 'portal',
                   other_database: 'portal',
                   direct: 'false'};




//launch Nodejs/Express only after DBs are initialized
require('./lib/db').init(db_settings, function(connections) {
    app.set("db_conn",connections["database"]);
    app.set("grid_conn",connections["grid"]);
    if (!app.get("direct")){
        app.set("db_other_conn",connections["other_database"]);
        app.set("grid_other_conn",connections["other_grid"]);
        app.set("message2",connections["message2"]);
    }
    server.listen(config.server.port);
    console.log("Server listening on port "+ config.server.port);
});
*/
