# frozen_string_literal: true

save_records = ARGV[0] == 'true'

def fields_with_old_avg_calculations
  return unless PrimeroModule.exists? unique_id: PrimeroModule::GBV

  avg_fields = Field.where("calculation -> 'expression' ? 'avg'")
  # The new type of calculated average field has the avg object as a hash, not an array.
  avg_fields.filter { |f| f.calculation.dig('expression', 'avg').is_a?(Array) }
end

def migrate_field(field, save)
  old_avg_data = field.calculation.dig('expression', 'avg')
  field.calculation = { type: 'number', expression: { avg: { data: old_avg_data, extra: { decimalPlaces: 2 } } } }
  field.disabled = true
  field.type = 'calculated'
  if save
    field.save!
    puts "Updated field #{field.name}"
  else
    puts "Would update #{field.name} to the following"
    puts field.inspect
  end
end

fields_with_old_avg_calculations.each { |f| migrate_field(f, save_records) }
