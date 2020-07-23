# frozen_string_literal: true

# Build and execute a Solr Sunspot query based on a collection of desired indicators.
# Indicators are used by the dashboards to compute aggregate statistics about records.
class IndicatorQueryService
  class << self
    def query(indicators, user)
      result = {}
      group_indicators(indicators).each do |record_model, record_indicators|
        record_type = record_model.parent_form
        result[record_type] = {}
        group_indicators_by_scope(record_indicators).each do |_, scoped_indicators|
          stats = statistics_for_indicators(scoped_indicators, record_model, user)
          result[record_type] = result[record_type].merge(stats)
        end
      end
      result
    end

    private

    def statistics_for_indicators(indicators, record_model, user)
      search = record_query(record_model, indicators, user)
      indicators.map { |i| [i.name, i.stats_from_search(search, user)] }.to_h
    end

    def record_query(record_model, indicators, user)
      record_model.search do
        user_query_scope = user.record_query_scope(record_model, false)
        SearchService.with_user_scope(self, user_query_scope[:user])
        SearchService.with_module_scope(self, user_query_scope[:module])

        indicators.each do |indicator|
          indicator.query(self, user)
        end
      end
    end

    def group_indicators(indicators)
      indicators.group_by(&:record_model)
    end

    def group_indicators_by_scope(indicators)
      indicators.group_by do |indicator|
        scope_key = indicator.scope&.map(&:to_h) || {}
        [
          indicator.scope_to_owner, indicator.scope_to_referred,
          indicator.scope_to_transferred, indicator.scope_to_owned_by_groups,
          indicator.scope_to_not_last_update, scope_key
        ]
      end
    end
  end
end
