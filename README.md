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