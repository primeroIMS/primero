Migrations in v2.16.1
========

**For all scripts below**:

 - Execute them in the order provided inthis file.
 - Run them without the `true` argument (or with `false`) to only log the number of record that would be
processed, and with `true` to actually save the values.


## Recalculate the Case `incident_types` for recently updated incidents.
Pass the date when `v2.16/calculate_case_incident_types.rb` was executed.

```bash
rails r ./db/data_migration/v2.16.1/recalculate_case_incident_types.rb 2026-10-27 true
```
