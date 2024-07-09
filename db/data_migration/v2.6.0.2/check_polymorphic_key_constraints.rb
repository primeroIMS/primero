# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

POLYMORPHIC_MODELS = [RecordHistory, Flag, Transition, Alert, AuditLog].freeze
RECORD_MODELS = [Child, Incident, TracingRequest, RegistryRecord].freeze
DELETABLE_POLYMORPHIC_MODELS = [RecordHistory, Flag, Transition, Alert].freeze

fix_records = ARGV[0] == 'true'

POLYMORPHIC_MODELS.each do |polymorphic_model|
  polymorphic_model_table_name = ActiveRecord::Base.connection.quote_table_name(polymorphic_model.table_name)
  RECORD_MODELS.each do |record_model|
    record_table_name = ActiveRecord::Base.connection.quote_table_name(record_model.table_name)

    puts "====> #{polymorphic_model_table_name} - #{record_table_name}"

    query =
      polymorphic_model
      .joins("LEFT JOIN #{record_table_name} ON #{polymorphic_model_table_name}.record_type='#{record_model}' \
        AND CAST(#{polymorphic_model_table_name}.record_id as varchar) = CAST (#{record_table_name}.id as varchar)")
      .where("#{polymorphic_model_table_name}.record_id is not null AND #{record_table_name}.id is null \
        AND #{polymorphic_model_table_name}.record_type='#{record_model}'")

    query = query.uniq { |entry| entry['record_id'] } if polymorphic_model == AuditLog

    total_records = query.count
    puts "====> #{query.count}"
    next unless fix_records && DELETABLE_POLYMORPHIC_MODELS.include?(polymorphic_model) && total_records.positive?

    puts("====> Deleting orphan #{polymorphic_model_table_name}")
    query.delete_all
    puts "====> Orphan #{polymorphic_model_table_name} after delete: #{query.reload.count}"
  end
  puts '------------------------'
end
