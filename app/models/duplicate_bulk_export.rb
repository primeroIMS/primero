# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Represents an asynchronous run of the query to retrieve all records
# that may share a duplicate id field value with another record.
class DuplicateBulkExport < BulkExport
  FACET_BATCH_SIZE = 100

  def process_records_in_batches(batch_size = 500, &)
    return yield([]) unless duplicate_field_name

    batched_duplicate_values = duplicate_values.in_groups_of(FACET_BATCH_SIZE, false)
    return yield([]) unless batched_duplicate_values.present?

    batched_duplicate_values.each do |values|
      search_for_duplicate_records(values, batch_size, &)
    end
  end

  def duplicate_values
    model_class.connection.select_all(duplicate_field_query.to_sql).rows.flatten
  end

  def duplicate_field_query
    status_filter = SearchFilters::TextValue.new(field_name: 'status', value: Record::STATUS_OPEN)
    state_filter = SearchFilters::BooleanValue.new(field_name: 'record_state', value: true)
    sanitized_field_name = ActiveRecord::Base.sanitize_sql_array(['data->>?', duplicate_field_name])

    model_class.select(sanitized_field_name).where(status_filter.query).where(state_filter.query)
               .group(sanitized_field_name)
               .having(ActiveRecord::Base.sanitize_sql_array(['COUNT(data->>?) > 1', duplicate_field_name]))
  end

  def search_for_duplicate_records(values, batch_size)
    page = 1
    sort = order || { national_id_no: :asc }
    search_filters = filters_for_duplicates(duplicate_field_name, values)
    loop do
      result = search_records(search_filters, batch_size, page, sort)
      break if result.records.blank?

      exporter.single_record_export = result.total == 1
      yield(result.records)
      page += 1
    end
  end

  def filters_for_duplicates(field_name, duplicates)
    [SearchFilters::TextList.new(field_name:, values: duplicates)]
  end

  def duplicate_field_name
    @duplicate_field_name ||= SystemSettings.current&.duplicate_export_field
  end

  def exporter_type
    Exporters::DuplicateIdCsvExporter
  end
end
