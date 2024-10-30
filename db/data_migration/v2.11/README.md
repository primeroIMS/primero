<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

Migrations in v2.11
========

## Introduction
In `v2.11` we are executing a script to store in PosgreSQL the fields that were used by Solr
to query for records and to update the location fields to a new naming convention.

## Verification data to be updated
You can review the data that will updated with:

```bash
rails r ./db/data_migration/v2.11/calculate_solr_fields.rb Child file/path.txt
```

returns reports which contain location fields that will be updated:
```bash
rails r ./db/data_migration/v2.11/migrate_location_fields.rb
```

returns the searchable identifiers to be generated:
```bash
rails r ./db/data_migration/v2.11/calculate_searchable_identifiers.rb Child false file/path.txt
```

returns information about the changes to be performed:
```bash
rails r ./db/data_migration/v2.11/calculate_incident_date_derived.rb false file/path.txt
```

## Executing scripts
Once you validate that the info is correct you can execute the script to modify the data using:

```bash
rails r ./db/data_migration/v2.11/calculate_solr_fields.rb Child true file/path.txt
```

```bash
rails r ./db/data_migration/v2.11/migrate_location_fields.rb true
```

```bash
rails r ./db/data_migration/v2.11/calculate_searchable_identifiers.rb Child true file/path.txt
```

```bash
rails r ./db/data_migration/v2.11/calculate_incident_date_derived.rb false file/path.txt
```

Remove stale solr jobs. pass until what date you want to delete them.
```bash
rails r ./db/data_migration/v2.11/remove_solr_jobs.rb 2024-09-30
```

