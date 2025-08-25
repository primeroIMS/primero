<!-- Copyright (c) 2014 - 2025 UNICEF. All rights reserved. -->

Migrations in v2.13.1
========

## Introduction
In `v2.13.1` we are executing a script to store in PosgreSQL the child_types for Incidents

## Executing scripts

```bash
rails r ./db/data_migration/v2.13.1/calculate_child_types.rb true file/path.txt
```

