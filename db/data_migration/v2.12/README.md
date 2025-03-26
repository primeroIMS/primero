<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Migrations in 2.12

This migration updates roles to include new dashboards and reports.

# Verification of data to be updated

These scripts will update the roles.

To validate which roles will be updated, run the following:

```bash
rails r ./db/migrations/v2.12/update_roles.rb
```

## Executing scripts
Once you validate that the info is correct you can execute the script to modify the data using:

```bash
rails r ./db/migrations/v2.12/update_roles.rb true
```
