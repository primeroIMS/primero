<!-- Copyright (c) 2014 - 2026 UNICEF. All rights reserved. -->

Migrations in v2.15
========

## Introduction
In `v2.15` we added a new transition fields and searchable columns for dashboards and the new searchable phone numbers.
Please run the scripts in the following order:

```bash
rails r ./db/data_migration/v2.15/calculate_transitionable_values.rb Child true
```

If the previous script was not executed the searchable values will not be calculated correctly.

```bash
rails r ./db/data_migration/v2.15/calculate_searchable_values.rb Child true
```

```bash
rails r ./db/data_migration/v2.15/calculate_searchable_phone_numbers.rb Child true
```
