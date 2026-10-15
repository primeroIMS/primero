Migrations in v2.16
========

**For all scripts below**:

 - Execute them in the order provided inthis file.
 - Run them without arguments (or with `false`) to only log the number of record that would be
processed, and with `true` to actually save the values.


## Calculate the Incident `cp_incident_violence` type.
This script only needs to be executed in environments with CP Incidents as it only updates the CP incidents.

```bash
rails r ./db/data_migration/v2.16.0/calculate_searchable_cp_incident_violence_type.rb true
```

## Calculate the Case `incident_types`.
This script only needs to be run in environments with non-MRM Incidents.

```bash
rails r ./db/data_migration/v2.16.0/calculate_case_incident_types.rb true
```