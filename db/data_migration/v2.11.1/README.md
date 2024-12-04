# Migrations in 2.11.1

This migration updates the configuration of GBV instances *only*. This migrates the fields that calculate average scores on subforms to new versions which support decimal places.

# Verification of data to be updated

These scripts will update the `Field` records where calculations exist.

To validate which fields will be updated, run the following:

```bash
rails r ./db/migrations/v2.11.1/update_calculated_avg_fields_gbv.rb
```