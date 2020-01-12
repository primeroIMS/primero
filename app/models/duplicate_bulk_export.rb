# frozen_string_literal: true

# Represents an asynchronous run of the query to retrieve all records
# that may share a duplicate id field value with another record.
class DuplicateBulkExport < BulkExport
  FACET_BATCH_SIZE = 100

  def self.get(id)
    DuplicateBulkExport.new(super(id))
  end

  def process_records_in_batches(batch_size = 500, &block)
    return yield([]) unless duplicate_field_name

    batched_duplicate_values = search_for_duplicate_values.in_groups_of(FACET_BATCH_SIZE, false)
    return yield([]) unless batched_duplicate_values.present?

    batched_duplicate_values.each do |values|
      search_for_duplicate_records(values, batch_size, &block)
    end
  end

  def search_for_duplicate_values
    result = model_class.search do
      with(:status, Record::STATUS_OPEN)
      with(:record_state, true)

      adjust_solr_params do |params|
        params['facet'] = 'true'
        params['facet.field'] = [solr_duplicate_field_name]
        params['facet.limit'] = '-1'
        params['facet.method'] = 'fcs'
        params['facet.threads'] = '-1'
        params["f.#{solr_duplicate_field_name}.facet.mincount"] = '2'
      end
    end.facet_response['facet_fields'][solr_duplicate_field_name]

    result.select { |value| value.is_a?(String) }
  end

  def search_for_duplicate_records(values, batch_size)
    pagination = { page: 1, per_page: batch_size }
    begin
      filters = filters_for_duplicates(duplicate_field_name, values)

      search = SearchService.search(
        model_class, filters, record_query_scope, query, { created_at: :desc }, pagination
      )
      results = search.results
      yield(results)
      # Set again the values of the pagination variable because the method modified the variable.
      pagination = { page: results.next_page, per_page: batch_size }
    end until results.next_page.nil?
  end

  def filters_for_duplicates(field_name, duplicates)
    [SearchFilters::ValueList.new(field_name: field_name, values: duplicates)]
  end

  def duplicate_field_name
    return @duplicate_field_name if @duplicate_field_name

    @duplicate_field_name = SystemSettings.current&.duplicate_export_field
  end

  def solr_duplicate_field_name
    @solr_duplicate_field_name ||=
      SolrUtils.indexed_field_name(record_type, duplicate_field_name)
  end

  def exporter_type
    Exporters::DuplicateIdCSVExporter
  end

  def job
    DuplicateBulkExportJob
  end
end