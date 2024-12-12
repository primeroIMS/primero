<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

Migrations in v2.13
========

## Introduction
In `v2.13` we are executing a script to store in PosgreSQL the fields that are commonly used to filter records.

## Verification data to be updated
You can review the data that will updated with:

```bash
rails r ./db/data_migration/v2.13/calculate_searchable_values.rb Child file/path.txt
```

## Executing scripts
Once you validate that the info is correct you can execute the script to modify the data using:

```bash
rails r ./db/data_migration/v2.13/calculate_searchable_values.rb Child true file/path.txt
```


