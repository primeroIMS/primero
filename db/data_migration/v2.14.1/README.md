<!-- Copyright (c) 2014 - 2025 UNICEF. All rights reserved. -->

Migrations in v2.14.1
========

## Introduction
In `v2.14.1` we added a new permission `disable_multiple` to superusers . Please run the script `add_disable_multiple_to_superusers.rb` from `v2.14.1`.

```bash
rails r ./db/data_migration/v2.14.1/add_disable_multiple_to_superusers.rb
```
