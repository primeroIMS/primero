Migrations in v2.16.0
========

This script only needs to be executed in environments with CP Incidents. It only updates the CP incidents.


Run it without arguments (or with `false`) to only log the number of CP incidents that would be processed, and with
`true` to save the values:

```bash
rails r ./db/data_migration/v2.16.0/calculate_searchable_cp_incident_violence_type.rb true
```
