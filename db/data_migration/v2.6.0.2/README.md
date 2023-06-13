Migrations in v2.6.0.2
========

## Introduction
In `v2.6.0.2` we are executing 5 scripts to update existing reports tha use the old workflow_status field, reports that has invalid filters, delete orphan records and recalculating has_case_plan field.

## Verification data to be updated
You can review the data that will updated with:

return reports that use `workflow` instead of `workflow_status`
```bash
rails r ./db/data_migration/v2.6.0.2/reports_use_workflow_status.rb
```

return reports that has `not_null` has value filter
```bash
rails r ./db/data_migration/v2.6.0.2/reports_update_not_null_filter_value.rb
```

return fields from `workflow_status` to `workflow`
```bash
rails r ./db/data_migration/v2.6.0.2/fields_rename_to_workflow.rb
```

return orphan polymorphic records
```bash
rails r ./db/data_migration/v2.6.0.2/check_polymorphic_key_constraints.rb.rb
```

return Child records where `has_case_plan` will be created
```bash
rails r ./db/data_migration/v2.6.0.2/recalculate_fields.rb false has_case_plan
```


## Executing scripts
Once you validate that the info is correct you can execute the script to modify the data using:

to update reports to use `workflow` instead of `workflow_status`
```bash
rails r ./db/data_migration/v2.6.0.2/reports_use_workflow_status.rb true
```

to update reports that has `not_null` has value filter
```bash
rails r ./db/data_migration/v2.6.0.2/reports_update_not_null_filter_value.rb true
```

to rename fields from `workflow_status` to `workflow`
```bash
rails r ./db/data_migration/v2.6.0.2/fields_rename_to_workflow.rb true
```

To delete orphan polymorphic records
```bash
rails r ./db/data_migration/v2.6.0.2/check_polymorphic_key_constraints.rb.rb true
```

To recalculate `has_case_plan`
```bash
rails r ./db/data_migration/v2.6.0.2/recalculate_fields.rb true has_case_plan
```