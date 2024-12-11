# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Service for the logic of bulk assign records
class BulkAssignService
  def initialize(model_class, transitioned_by, args)
    @model_class = model_class
    @transitioned_by = transitioned_by
    @args = args
  end

  def assign_records!
    # # Using unscope(:includes) to exclude eager loading, as relationships are not needed for this query.
    search_records.records.unscope(:includes).in_batches(of: 10) do |records|
      assign_records_batch(records)
    end
  end

  def search_records
    PhoneticSearchService.search(
      @model_class, query:, phonetic:, filters: search_filters,
                    sort: sort_order, scope: query_scope
    )
  end

  private

  def assign_records_batch(records)
    records.each do |record|
      next unless record.can_be_assigned? && @transitioned_by.can_assign?(record)

      create_assignment(record)
    rescue StandardError => e
      Rails.logger.error e.message
      next
    end
  end

  def create_assignment(record)
    Assign.create!(
      record:,
      transitioned_to: @args[:transitioned_to],
      transitioned_by: @transitioned_by.user_name,
      notes: @args[:notes],
      from_bulk_export: true
    )
  end

  def query_scope
    @transitioned_by.record_query_scope(@model_class, @args[:id_search])
  end

  def sort_order
    { order_by => @args[:order] || 'desc' }
  end

  def order_by
    @order_by ||= @args[:order_by] || 'created_at'
  end

  def phonetic
    @args.dig(:filters, :phonetic) || 'false'
  end

  def query
    @args[:query] || ''
  end

  def search_filters
    SearchFilterService.new.build_filters(DestringifyService.destringify(@args[:filters].except(:phonetic).to_h, true))
  end
end
