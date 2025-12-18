<!-- Copyright (c) 2014 - 2025 UNICEF. All rights reserved. -->

Migrations in v2.14.1
========

## Introduction
In `v2.14.1` we added the Unused Fields Report. This report is periodically executed but in order to make it
available for users right away, please execute the following:

```bash
  rails r ./db/data_migration/v2.14.1/generate_unused_fields_report.rb true
```
