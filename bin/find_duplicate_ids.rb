# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

def print_log(message)
  message = "#{DateTime.now.strftime('%m/%d/%Y %H:%M')}|| #{message}"
  puts message
end

show_records = ARGV[0] || false
fix_records = ARGV[1] || false

def find_duplicates(model, id_field)
  ActiveRecord::Base.connection.execute(
    model.select(
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ['data->>? as record_id, count(*) as total_duplicates', id_field]
      )
    ).having('count(*) > 1')
     .group(ActiveRecord::Base.sanitize_sql_for_conditions(['data->>?', id_field]))
     .to_sql
  ).to_a
end

def show_record_details(results, id_field, model)
  results.each do |result|
    print_log("---#{id_field} = #{result['record_id']} has #{result['total_duplicates']} duplicate(s).---")
    ids = Child.where('data->>? = ?', id_field, result['record_id']).pluck(:id)
    print_log("Duplicated #{model.name} ids: #{ids}")
  end
end

def fix_duplicated_records(results, id_field, model)
  results.each do |result|
    Child.where('data->>? = ?', id_field, result['record_id']).each_with_index do |record, index|
      print_log("Fixing #{model.name}.id = #{record.id}...")
      record.case_id = "#{record.case_id}#{index}"
      record.save!
    end
  end
end

[Child, Incident, TracingRequest].each do |model|
  id_field = "#{model.parent_form}_id"
  results = find_duplicates(model, id_field)

  if results.blank?
    print_log("No duplicates found for #{model.name}")
    next
  end

  affected_records = results.reduce(0) { |acc, result| acc + result['total_duplicates'] }

  print_log("---Duplicated #{id_field}(s): #{results.size} || Affected records: #{affected_records}--")

  next unless show_records

  show_record_details(results, id_field, model)

  next unless fix_records

  fix_duplicated_records(results, id_field, model)
end

print_log('---Done.---')
