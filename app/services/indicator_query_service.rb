# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Build and execute a SQL query based on a collection of desired indicators.
# Indicators are used by the dashboards to compute aggregate statistics about records.
class IndicatorQueryService
  class << self
    def query(indicators, user)
      group_indicators(indicators).each_with_object({}) do |(record_model, record_indicators), result|
        record_type = record_model.parent_form
        result[record_type] = {}
        stats = group_indicators_by_name(record_indicators).reduce({}) do |memo, (name, grouped_indicators)|
          memo.merge(name => grouped_indicators.first.stats_for_indicator(user))
        end
        result[record_type] = result[record_type].merge(stats)
      end
    end

    private

    def group_indicators(indicators)
      indicators.group_by(&:record_model)
    end

    def group_indicators_by_name(indicators)
      indicators.group_by(&:name)
    end
  end
end
