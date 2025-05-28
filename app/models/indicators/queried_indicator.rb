# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Class for Queried Indicator
  class QueriedIndicator < AbstractIndicator
    # rubocop:enable Style/ClassAndModuleChildren
    attr_accessor :queries

    def self.type
      'queried_indicator'
    end

    def write_stats_for_indicator(indicator_filters, user_query_scope, _managed_user_names = [])
      indicator_query = query(indicator_filters, user_query_scope)
      { name => { 'count' => indicator_query.count, 'query' => stat_query_strings(name, indicator_filters) } }
    end

    def filters(user)
      query_scope(user) + queries
    end

    def stat_query_strings(_, indicator_filters)
      indicator_filters.map(&:to_s)
    end
  end
end
