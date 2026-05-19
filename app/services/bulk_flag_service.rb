# frozen_string_literal: true

# Service for the logic of bulk flag records
class BulkFlagService
  def initialize(model_class, flagged_by, args)
    @model_class = model_class
    @flagged_by = flagged_by
    @args = args
  end

  def flag_records!
    search_records.records.unscope(:includes).in_batches(of: 10) do |records|
      records.each do |record|
        record.add_flag!(@args[:message], @args[:date]&.to_date, @flagged_by.user_name)
      rescue StandardError => e
        Rails.logger.error e.message
        next
      end
    end
  end

  def search_records
    PhoneticSearchService.search(
      @model_class, query:, phonetic:, filters: search_filters,
                    sort: sort_order, scope: query_scope,
                    pagination: { page: 1, per_page: Flag::MAX_BULK_FLAGS }
    )
  end

  private

  def query_scope
    @flagged_by.record_query_scope(@model_class, @args[:id_search])
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
