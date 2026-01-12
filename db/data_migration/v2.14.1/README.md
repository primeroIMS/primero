<!-- Copyright (c) 2014 - 2025 UNICEF. All rights reserved. -->

Migrations in v2.14.1
========

## Introduction

In `v2.14.1` we added a new permission `disable_multiple` to superusers . Please run the script `add_disable_multiple_to_superusers.rb` from `v2.14.1`.
Additionally the Unused Fields Report was added. This report is periodically executed but in order to make it available
for users right away, please run the script `generate_unused_fields_report.rb` from `v2.14.1`.


```bash
rails r ./db/data_migration/v2.14.1/add_disable_multiple_to_superusers.rb
```

```bash 
rails r ./db/data_migration/v2.14.1/generate_unused_fields_report.rb true
```
