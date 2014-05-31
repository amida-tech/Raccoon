Raccoon
=========

Raccoon is a node.js Data Raccoonciliation Engine for Health Data.

(This repo is discontinued see Raccoon's components below)

![Raccoon](http://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Yawning_Raccoon.jpg/976px-Yawning_Raccoon.jpg)


High Level Overview
===================
![Raccoon High Level Diagram](docs/img/dre_overview.png)

Purpose of Data Raccoonciliation Engine is to take personal health data in variety of formats (starting with BlueButton/CCDA) from multiple sources and parse/normalize/de-duplicate/merge it into single Patient's Master Health Record with patient's assistance (thou, most of hard work will be done automagically).


Raccoon's components
=================
![Raccoon Components Diagram](docs/img/dre_steps_mvp.png)

Raccoon has 4 primary elements

#### 1 - Parsing and Normalization Library.

This parses incoming data into a homogenous, simplified data model.  Currently, this is served by bluebutton.js; however this will be refactored into a more efficient, server-only model.

#### 2 - Matching Library.

This takes the standardized data elements and flags probable duplicates values. New patient's records are compared against existing Master Health Record and automatically matched with result produced as all elements of a new record are flagged as duplicates, new and % of match (to be reconciled by patient in a next step).

#### 3 - Reconciliation Interface.

This provides a RESTful API for review and evaluation of duplicates.

#### 4 - Master Record Interface.

This provides a RESTful API for interaction with and access to the aggregated health record.

Project Roadmap (tentative)
===============

Release 0.5 (end of April, 2014)
----------------

- Uses existing bluebutton.js lib for parsing (with some fixes/improvements)
- Matching library detects duplicate, new entries, and partial matches
- Reconciliation UI supports duplicate and new entries reconciliation
- Master Health Record library supports persistence to MongoDB
- Data model for CCDA JSON representation is defined for a few sections (e.g. Allergies)

Release 1.0 (end of May, 2014)
----------------

- CCDA JSON data model is fully defined as separate library with validation support
- bluebutton.js parser is rewriten for speed and support of updated CCDA JSON data model.
- Matching library supports % match for entries that may be possible match
- Reconciliation UI support reconciliation of % matched entries (e.g. partial match)
- Master Health Record library supports persistence and full validation of CCDA JSON into MongoDB


Components Documentation
========================

UNDER CONSTRUCTION!!!

Parsing library is refactored and lives at [amida-tech/blue-button](https://github.com/amida-tech/blue-button)
[![NPM](https://nodei.co/npm/blue-button.png)](https://nodei.co/npm/blue-button/)


Matching library is refactored and lives at [amida-tech/blue-button-match](https://github.com/amida-tech/blue-button-match)
[![NPM](https://nodei.co/npm/blue-button-match.png)](https://nodei.co/npm/blue-button-match/)

Reconciliation interface lives at [amida-tech/DRE-UX](https://github.com/amida-tech/DRE-UX)

Master Record library is in process of refactoring and temporarily is part of [amida-tech/DRE-UX](https://github.com/amida-tech/DRE-UX)

