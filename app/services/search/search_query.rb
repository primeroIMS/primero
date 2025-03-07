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
    apply_filters(apply_scope(record_class.eager_loaded_class))
  end

  def apply_scope(record_query)
    return record_query unless scope.present?

    Search::SearchScope.apply(scope, record_query)
  end

  def apply_filters(record_query)
    return record_query unless filters.present?

    filters.each { |filter| record_query = apply_filter(record_query, filter) }
    record_query
  end

  def apply_filter(record_query, filter)
    if record_class.normalized_field_name?(filter.field_name)
      record_query.joins(filter.searchable_join_query(record_class.name))
    else
      filter.not_filter ? record_query.where.not(filter.query) : record_query.where(filter.query)
    end
  end
end
