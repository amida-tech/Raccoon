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

var events = require("events");
var mongoose = require('mongoose');

var logger = exports.logger = require('winston');

/*
 * Catches and re-emits connection events
 */

var emitter = new events.EventEmitter();
exports.on = function(key, callback) {
    emitter.on(key, callback);
};

/*
 * Connection
 */

var DBInfo = function(ownerDbTitle, sectionDbTitleList) {
    if (! ownerDbTitle) {
        ownerDbTitle = 'owner';
    }
    if (! sectionDbTitleList) {
        sectionDbTitleList = ['demographics', 'allergies', 'encounters', 'immunizations',  'results', 'medications', 'problems', 'procedures', 'vitals'];
    }
    this.ownerDbTitle = ownerDbTitle;
    this.sectionDbTitleList = sectionDbTitleList;
    
    var sectionDbTitleSet = Object.create(null);
    var ownerSchemaDesc = Object.create(null);
    sectionDbTitleList.forEach(function(sectionTitle) {
        sectionDbTitleSet[sectionTitle] = true;
        ownerSchemaDesc[sectionTitle] = mongoose.Schema.Types.ObjectId;
    });
    this.sectionDbTitleSet = sectionDbTitleSet;
    
    this.ownerSchema = new mongoose.Schema(ownerSchemaDesc);    
    this.sectionSchema = new mongoose.Schema({
        owner: String,
        data: {},
        metadata: {}
    });
};

var connection = null;
var dbInfo = new DBInfo();

exports.connect = function(uri) {
    if (connection) {
        logger.debug('already connected to phr database');
        emitter.emit('error', new Error('Already connected.'));
        return;
    };
    
    if (! uri) {
        uri = 'mongodb://localhost/portal';
    };
    
    var c = mongoose.createConnection(uri);

    c.on('connected', function() {
        logger.debug('connected to phr database');
        emitter.emit('connected');
        connection = c;
    });

    c.on('error', function(err) {
        logger.debug('error on connection to phr database: ' + err);
        emitter.emit('error', err);
    });

    c.on('disconnected', function() {
        logger.debug('disconnected from phr database');
        emitter.emit('disconnected');
        connection = null;
    });
};

exports.disconnect = function() {
    if (! connection) {
        logger.debug('not connected to phr database');
        emitter.emit('error', new Error('Not connected.'));
        return;
    };    
    connection.close();
};

/*
 * Database update
 */

var createSection = function(sectionName, owner, input, callback) {
    var sectionModel = connection.model(sectionName, dbInfo.sectionSchema);
    inputRecord = {
        owner: owner,
        data: input.data,
        metadata: input.metadata
    };
    sectionModel.create(inputRecord, function(err, record) {
        if (err) {
            callback(err);
        } else {
            callback(null, record._id);
        }
    });
};

var updateOwner = function(owner, sectionIds, callback) {
    logger.debug('in updateOwner');
    var ownerModel = connection.model('owners', dbInfo.ownerSchema);
    ownerModel.findOne({owner: owner}, function(err, ownerRecord) {
        if (err) {
            callback(err);
            return;
        }
        if (! ownerRecord) {
            ownerRecord = new ownerModel({owner: owner});
        }
        var existingSectionIds = Object.create(null);
        Object.keys(sectionIds).forEach(function(sectionName) {
            if (dbInfo.sectionDbTitleSet[sectionName]) {
                var existingId = ownerRecord[sectionName];
                ownerRecord[sectionName] = sectionIds[sectionName];
                if (existingId) {
                    existingSectionIds[sectionName] = existingId;
                }
            }
        });
        ownerRecord.save(function(err) {
            if (! err) {
                Object.keys(existingSectionIds).forEach(function(sectionName) {
                    var existingId = existingSectionIds[sectionName];
                    var sectionModel = connection.model(sectionName, dbInfo.sectionSchema);
                    sectionModel.findByIdAndRemove(existingId);
                });
            }
            callback(err);
        });
    });
};

exports.putMaster = function(owner, inputRecord, options, callback) {
    logger.debug('entered putMaster');
    if (! connection) {
        var err = new Error('Database connection is not available.');
        callback(err);
        return;
    }
    var sectionCount = 0;
    var sectionRecords = Object.create(null);
    Object.keys(inputRecord).forEach(function(sectionName) {
        if (dbInfo.sectionDbTitleSet[sectionName]) {
            ++sectionCount;
            sectionRecords[sectionName] = inputRecord[sectionName];
        };
    });
    if (options && options.deleteMissing) {
        dbInfo.sectionDbTitleList.forEach(function(sectionName) {
            if (sectionRecords[sectionName] === undefined) {
                sectionRecords[sectionName] = null;
            };
        });
    }
    var createdSectionCount = 0;
    var ids = Object.create(null);
    Object.keys(sectionRecords).forEach(function(sectionName) {
        var sectionRecord = sectionRecords[sectionName];   
        createSection(sectionName, owner, sectionRecord, function(err, id) {
            if (ids) {
                if (err) {
                    ids = null;
                    callback(err);
                } else {
                    ids[sectionName] = id;
                    createdSectionCount += 1;
                    if (createdSectionCount === sectionCount) {
                        updateOwner(owner, ids, callback);
                    };
                }
            }
        });
    });
};

var optionsToSectionNames = function(options) {
    if (options && options.sections) {
        return options.sections;
    } else {
        return dbInfo.sectionDbTitleList;
    }
};

exports.getMaster = function(owner, options, callback) {
    if (! connection) {
        var err = new Error('Database connection is not available.');
        callback(err);
        return;
    }
    var sectionNames = optionsToSectionNames(options);
    var ownerModel = connection.model('owners', dbInfo.ownerSchema);
    ownerModel.findOne({owner: owner}, function(err, ownerRecord) {
        if (err) {
            callback(err);
            return;
        }
        if (! ownerRecord) {
            callback(null, null);
            return;
        }
        var count = 0;
        var result = Object.create(null);
        var updateResult = function(sectionName, id) {
            if (result) {
                ++count;
                result[sectionName] = id;
                if (count === sectionNames.length) {
                    callback(null, result);
                }
            }
        };
        sectionNames.forEach(function(sectionName) {
            var id = ownerRecord[sectionName];
            if (id) {
                var sectionModel = connection.model(sectionName, dbInfo.sectionSchema);
                sectionModel.findById(id, function(err, sectionRecord) {
                    if (err) {
                        callback(err);
                        result = null;
                    } else {
                        updateResult(sectionName, sectionRecord);
                    }
                });
            } else {
                updateResult(sectionName, null);
            }
        });
    });
};

var putSection = function(sectionName, owner, sectionRecord, callback) {
    var inputRecord = Object.create(null);
    inputRecord[sectionName] = sectionRecord;
    putMaster(owner, inputRecord, null, callback);
};

var getSection = function(sectionName, owner, callback) {
    var options = Object.create(null);
    options.section = [sectionName];
    getMaster(owner, options, function(err, sectionRecords) {
        var sectionRecord = sectionRecords ? sectionRecords[sectionName] : null;
        callback(err, sectionRecord);
    });
};

dbInfo.sectionDbTitleList.forEach(function(sectionName) {
    var capitalizedSectionName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
    
    exports['put' + capitalizedSectionName] = function(owner, sectionRecord, callback) {
        putSection(sectionName, owner, sectionRecord, callback);
    };
    
    exports['get' + capitalizedSectionName] = function(owner, callback) {
        getSection(sectionName, owner, callback);
    };
});
