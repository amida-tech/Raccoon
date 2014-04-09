Raccoon
=========

Raccoon is a node.js Data Raccoonciliation Engine for Health Data.

![Raccoon](http://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Yawning_Raccoon.jpg/976px-Yawning_Raccoon.jpg)

Raccoon has 4 primary elements

Parsing and Normalization Library.
---------
This parses incoming data into a homogenous, simplified data model.  Currently, this is served by bluebutton.js; however this will be refactored into a more efficient, server-only model.

Matching Library.
---------
This takes the standardized data elements and flags probable duplicates values.

Reconciliation Interface.
---------
This provides a RESTful API for review and evaluation of duplicates.

Master Record Interface.
---------
This provides a RESTful API for interaction with and access to the aggregated health record.

Database Access
---------
record.js

This is the layer for access to the actual database.  Currently only implemented for Mongo using Mongoose package.

API consists of four main methods to connect to/disconnnect from database, put master record and get master record.  Also provided 
convenience methods to put and get individual sections.

```connect([uri], [options])```

Requests connections to the database and does the necessary initializations.  record.js raises three events to deal with connections: 
'connected', 'error', and 'disconnected'.  Events are preferred as opposed to callbacks to provide applications access to errors after
connection is established such as power down.  record.js keeps track of the connection on the module level and you cannot connect or 
disconnect multiple times. This alleviates the need for applications to keep track of the connection object.

uri is the address of the database and defaults to 'mongodb://localhost/portal'.  options is included for customization and 
testing purposes.  Currently only two fields are supported:

ownerTitle: This is a label internally used to identify database elements that stores owner specific info.  Defaults to 'owner'
sectionTitles: This is an array of section titles in the master records.  Default to 
['demographics', 'allergies', 'encounters', 'immunizations',  'results', 'medications', 'problems', 'procedures', 'vitals'].

These two fields are primarily being used for testing purposes where whole database elements (Mongo collections) can be dropped 
without affecting anything outside record.js.  They also make it possible to change the list of supported sections without any code 
change in record.js.

```disconnect()```

This ends the previously established connection.  It is expected to be called when application quits.

```putMaster(owner, input, [options], callback)```

This puts a master record (input) into the database.

"owner" is the key (String) for the owner of the master record.  It is the only field used to identify who the owner 
of the master record.  It is also likely to be used as an index. 

"input" is assumed to have fields each associated with a particular section. Each field is assumed to be in the form

input['demographics'] = {data: <any object>, metadata: <any object>}

and all other sections (allergies, demographics, etc.).  Other than this structure record.js does not assume anything
on the actual content of the data and metadata.  Anything that is passed in data and metadata fields are stored as BLOBS.

By default only those sections that has a key in "input" is updated.  You can set any section explicitly to null to remove
from the master record.  

"options" is added for future customizations.  Currently only field that is supported is 'deleteMissing' which can be used
to delete all the sections that are not explicitly specified in "input".

"callback" only returns a single error parameter.  Unlike other typical database update libraries it does not return 
actual stored object so that any actual database dependency is limited to record.js.

```getMaster(owner, [options], callback)```

This gets a master record in the database.

'owner' is explained in putMaster.

By default all the sections in the master record is returned.  You can specify a subset by settings 'sections' field 
of "options" (for example options.sections = ['demographics', 'medications']).

"callback(error, result)" returns the result of the query.  The format of the result is identical to the input described 
in putMaster.


In addition of the master record methods convenience section methods are alsa supplied

```putDemographics(owner, input, callback)```
```getDemographics(owner, callback)```

and similar for other sections.  For sections 'input' is in the form {data: <any object>, metadata: <any object>}.  The result is returned
in the same form in the get methods.


```dropAll(callback)```

A drop all method is provided to remove all the artifacts related to the master record from the database.  It is used in unit
tests.

Database Design
--------

record.js insulates the actual design of the database from the higher levels.  This summarizes some of those details.

Current implementation is based on MongoDB and almost exclusively use Mongoose package; only exception is dropping collections which 
uses native MongoDB methods.  Each section in the master record gets its own collection (demographics, allergies, etc). For each collection
the schema is 

{owner: String, data: {}, metadata: {}}

where there are no restrictions on the data and metadata objects.  

owner in the section collections are not used for lookups.  Instead there is an additional owner collection with Schema

{owner: String, demographics: ObjectId, medications: ObjectId, ...}

and all owner look ups use this collection.  Currently all the section collection elements are removed immediately once they are 
replaced by a new master record.  However the chosen database structure lends itself nicely to keep "zombie" section collection elements
around if we choose that route in the future.  Replaced sections can be transfered to an archive and or removed overnight batch process 
to decrease load  during peak times.

