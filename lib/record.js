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

exports.once = function(key, callback) {
    emitter.once(key, callback);
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
    ownerSchemaDesc.owner = String;
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
    
    sectionDbTitleList.forEach(function(sectionTitle) {
        var capitalizedSectionTitle = sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1);
        
        exports['put' + capitalizedSectionTitle] = function(owner, sectionRecord, callback) {
            putSection(sectionTitle, owner, sectionRecord, callback);
        };
        
        exports['get' + capitalizedSectionTitle] = function(owner, callback) {
            getSection(sectionTitle, owner, callback);
        };
    });
    
    this.connection = null;
};

DBInfo.prototype.connect = function(uri) {
    var c = mongoose.createConnection(uri);
    var that = this;
    
    c.on('connected', function() {
        logger.debug('connected to phr database');
        that.connection = c;
        
        that.sectionModel = Object.create(null);
        that.sectionDbTitleList.forEach(function(sectionTitle) {
            that.sectionModel[sectionTitle] = c.model(sectionTitle, that.sectionSchema);
        });
        that.ownerModel = c.model(that.ownerDbTitle, dbInfo.ownerSchema);
        emitter.emit('connected');
    });
    
    c.on('error', function(err) {
        logger.debug('error on connection to phr database: ' + err);
        emitter.emit('error', err);
    });
    
    c.on('disconnected', function() {
        logger.debug('disconnected from phr database');
        emitter.emit('disconnected');
        that.connection = null;
        that.sectionModel = null;
        that.ownerModel = null;
    });
};

DBInfo.prototype.dropOwner = function(callback) {
    var p = this.connection.collections[this.ownerDbTitle + "s"];
    if (p) {
        p.drop(function(err) {
            callback(err);
        });
    } else {
        callback();
    }
};

DBInfo.prototype.dropAll = function(callback) {
    logger.debug("dropping all");
    if (this.connection) {
        var result = Object.create(null);
        var numSections = this.sectionDbTitleList.length;
        var count = 0;
        var that = this;
        this.dropOwner(function(err) {
            result[this.ownerDbTitle] = err;
            that.sectionDbTitleList.forEach(function(sectionTitle) {
                var r = that.connection.collections[sectionTitle + "s"];
                if (r) {
                    logger.debug("dropping " + sectionTitle + "s");
                    r.drop(function(err) {
                        ++count;
                        result[sectionTitle] = err;
                        if (count == numSections) {
                            callback(null, result);
                        };
                    });
                } else {
                    ++count;
                    result[sectionTitle] = null;
                    if (count == numSections) {
                        callback(null, result);
                    };
                }
            });
        });
    } else {
        callback(new Error('No connection.'));
    }
};

var dbInfo;

exports.connect = function(uri, options) {
    if (dbInfo) {
        logger.debug('already connected to phr database');
        emitter.emit('error', new Error('Already connected.'));
        return;
    }
    
    if (! uri) {
        uri = 'mongodb://localhost/portal';
    }
    var ownerTitle = options && options.ownerTitle;
    var sectionTitles = options && options.sectionTitles;
    dbInfo = new DBInfo(ownerTitle, sectionTitles);
    dbInfo.connect(uri);
};

exports.disconnect = function(callback) {
    if (! dbInfo) {
        logger.debug('not connected to phr database');
        emitter.emit('error', new Error('Not connected.'));
        callback(new Error('Not connected.'));
        return;
    };
    dbInfo.connection.close(function() {
        dbInfo = null;
        callback();
    });
};

/*
 * Database update
 */

var createSection = function(sectionName, owner, input, callback) {
    logger.debug('entered createSection');
    inputRecord = {
        owner: owner,
        data: input && input.data,
        metadata: input && input.metadata
    };
    dbInfo.sectionModel[sectionName].create(inputRecord, function(err, record) {
        if (err) {
            callback(err);
        } else {
            callback(null, record._id);
        }
    });
};

var updateOwner = function(owner, sectionIds, callback) {
    logger.debug('entered updateOwner');
    var ownerModel = dbInfo.ownerModel;
    ownerModel.findOne({'owner': owner}, function(err, ownerRecord) {
        if (err) {
            callback(err);
            return;
        }
        if (! ownerRecord) {
            ownerRecord = new ownerModel({'owner': owner});
            ownerRecord.owner = owner;
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
                    var sectionModel = dbInfo.connection.model(sectionName, dbInfo.sectionSchema);
                    sectionModel.findByIdAndRemove(existingId);
                });
            }
            callback(err);
        });
    });
};

var putMaster = exports.putMaster = function(owner, inputRecord, options, callback) {
    logger.debug('entered putMaster');
    if (! dbInfo) {
        var err = new Error('Database connection is not available.');
        callback(err);
        return;
    }
    if (typeof inputRecord !== 'object') {
        callback(new Error("Invalid input for master record."));
        return;
    }
    var sectionCount = 0;
    var sectionRecords = Object.create(null);
    Object.keys(inputRecord).forEach(function(sectionName) {
        if (dbInfo.sectionDbTitleSet[sectionName]) {
            ++sectionCount;
            var r = inputRecord[sectionName];
            sectionRecords[sectionName] = r;
            if (r && ! (r.data && r.metadata)) {
                callback(new Error('Input for ' + sectionName + ' missing data and/or metadata properties.'));
                return;
            }
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
        if (sectionRecord) {
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
        } else if (ids) {
            ids[sectionName] = null;
            createdSectionCount += 1;
            if (createdSectionCount === sectionCount) {
                updateOwner(owner, ids, callback);
            };
        }
    });
};

var optionsToSectionNames = function(options) {
    if (options && options.sections) {
        return options.sections;
    } else {
        return dbInfo.sectionDbTitleList;
    }
};

var getMaster = exports.getMaster = function(owner, options, callback) {
    if (! dbInfo) {
        var err = new Error('Database connection is not available.');
        callback(err);
        return;
    }
    var sectionNames = optionsToSectionNames(options);
    var ownerModel = dbInfo.ownerModel;
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
        var updateResult = function(sectionName, record) {
            if (result) {
                ++count;
                result[sectionName] = record;
                if (count === sectionNames.length) {
                    callback(null, result);
                }
            }
        };
        sectionNames.forEach(function(sectionName) {
            var id = ownerRecord[sectionName];
            if (id) {
                var sectionModel = dbInfo.connection.model(sectionName, dbInfo.sectionSchema);
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
    if (sectionRecord && ! (sectionRecord.data && sectionRecord.metadata)) {
        callback(new Error('Input missing data and/or metadata properties.'));
    } else {
        var inputRecord = Object.create(null);
        inputRecord[sectionName] = sectionRecord;
        putMaster(owner, inputRecord, null, callback);
    }
};

var getSection = function(sectionName, owner, callback) {
    var options = Object.create(null);
    options.section = [sectionName];
    getMaster(owner, options, function(err, sectionRecords) {
        var sectionRecord = sectionRecords && sectionRecords[sectionName];
        callback(err, sectionRecord);
    });
};

/*
 * Testing support
 */

exports.dropAll = function(callback) {
    logger.debug("entered dropAll");
    if (dbInfo) {
        dbInfo.dropAll(callback);
    } else {
        callback(new Error('No connection.'));
    }
};
