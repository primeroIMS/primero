# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Build and execute a Solr Sunspot query based on a collection of desired indicators.
# Indicators are used by the dashboards to compute aggregate statistics about records.
class IndicatorQueryService
  class << self
    def query(indicators, user)
      managed_user_names = indicators.any?(&:scope_to_user) ? user.managed_user_names : []
      group_indicators(indicators).each_with_object({}) do |(record_model, record_indicators), result|
        record_type = record_model.parent_form
        result[record_type] = {}
        group_indicators_by_scope(record_indicators).each do |_, scoped_indicators|
          stats = statistics_for_indicators(scoped_indicators, record_model, user, managed_user_names)
          result[record_type] = result[record_type].merge(stats)
        end
      end
    end

    private

    def statistics_for_indicators(indicators, record_model, user, managed_user_names)
      search = record_query(record_model, indicators, user)
      indicators.to_h { |i| [i.name, i.stats_from_search(search, user, managed_user_names)] }
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
        pivots = indicator.is_a?(Indicators::PivotedIndicator) ? indicator.pivots : []
        [
          indicator.scope_to_owner, indicator.scope_to_referred,
          indicator.scope_to_transferred, indicator.scope_to_owned_by_groups,
          indicator.scope_to_not_last_update, indicator.scope_to_transferred_groups, scope_key,
          indicator.exclude_zeros, indicator.scope_to_user, pivots
        ]
      end
    end
  end
end
