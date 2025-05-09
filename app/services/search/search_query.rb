# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A class to generate a SQL query
class Search::SearchQuery
  attr_accessor :record_class, :filters, :scope, :query

  def initialize(record_class)
    self.record_class = record_class
    self.filters = []
  end

  def with_scope(scope)
    self.scope = scope
    self
  end

  def with_filters(filters)
    self.filters = filters
    self
  end

  def with_query(query)
    self.query = query
    self
  end

  def build
    record_query = record_class.eager_loaded_class
    query_filters = Search::SearchScope.scope_filters(scope) + filters
    query_filters.each { |filter| record_query = record_query.where(filter.query(record_class)) }
    record_query
  end
end
