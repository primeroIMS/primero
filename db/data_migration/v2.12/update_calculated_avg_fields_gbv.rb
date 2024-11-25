# frozen_string_literal: true

save_records = ARGV[0] == 'true'

def fields_with_old_avg_calculations
  return unless PrimeroModule.exists? unique_id: PrimeroModule::GBV

  avg_fields = Field.where("calculation -> 'expression' ? 'avg'")
  # The new type of calculated average field has the avg object as a hash, not an array.
  avg_fields.filter { |f| f.calculation.dig('expression', 'avg').is_a?(Array) }
end

def migrate_field(orig_field, save)
  old_avg_data = orig_field.calculation.dig('expression', 'avg')
  new_field = orig_field.dup
  new_field.calculation = { type: 'number', expression: { avg: { data: old_avg_data, extra: { decimalPlaces: 2 } } } }
  new_field.disabled = true
  new_field.type = 'calculated'
  if save
    # We because the type of a field cannot be changed, we need to destroy and recreate
    orig_field.destroy!
    new_field.save!
    puts "Updated field #{new_field.name}"
  else
    puts "Would update #{new_field.name} to the following"
    puts new_field.inspect
  end
end

fields_with_old_avg_calculations.each { |f| migrate_field(f, save_records) }
