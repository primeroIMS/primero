<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

Migrations in v2.11
========

## Introduction
In `v2.11` we are executing a script to store in PosgreSQL the fields that were used by Solr
to query for records.

## Verification data to be updated
You can review the data that will updated with:

```bash
rails r ./db/data_migration/v2.11/calculate_solr_fields.rb Child
```

## Executing scripts
Once you validate that the info is correct you can execute the script to modify the data using:

```bash
rails r ./db/data_migration/v2.11/calculate_solr_fields.rb Child true
```
