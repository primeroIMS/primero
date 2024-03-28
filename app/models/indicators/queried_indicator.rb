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

    def query(user)
      user_query_scope = user.record_query_scope(record_model, false)
      query = Search::SearchScope.apply(user_query_scope, record_model)
      filters(user).each do |filter|
        query = filter.not_filter ? query.where.not(filter.query) : query.where(filter.query)
      end
      { 'count' => query.size }
    end

    def filters(user)
      query_scope(user) + queries
    end

    def stats(user)
      { name => query(user).merge('query' => stat_query_strings(name, user)) }
    end

    def stat_query_strings(_, user)
      filters(user).map(&:to_s)
    end
  end
end
