# frozen_string_literal: true

# Example of usage:
# rails r bin/recalculate_fields true field1
# rails r bin/recalculate_fields true field1,field2

def print_log(message)
  message = "#{DateTime.now.strftime('%m/%d/%Y %H:%M')}|| #{message}"
  puts message
end

save_records = ARGV[0] == 'true'
fields_to_recalculate = (ARGV[1] || '').split(',')

if fields_to_recalculate.present?
  Child.find_in_batches(batch_size: 1000) do |records|
    records.each do |record|
      fields_to_recalculate.each do |field|
        field_value = record.send("calculate_#{field}".to_sym)

        if save_records
          record.update_column('data', record.data.merge(field => field_value))
          print_log("Child Id:#{record.id} updated with #{field} = #{field_value}")
        else
          print_log("Child Id:#{record.id} will be updated with #{field} = #{field_value}")
        end
      end
    end
  end
else
  print_log('No fields to recalculate were specified.')
end
