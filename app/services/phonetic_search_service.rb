# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A service that performs phonetic searches using SQL
class PhoneticSearchService
  MATCHED_QUERY_COUNT = %(
    (
      SELECT COUNT(phonetic) FROM JSONB_ARRAY_ELEMENTS_TEXT(phonetic_data->'tokens') AS phonetic
      WHERE ARRAY[:values] @> ARRAY[phonetic]
    )
  )

  MISMATCHED_QUERY_COUNT = %(
    (
      SELECT COUNT(phonetic) FROM JSONB_ARRAY_ELEMENTS_TEXT(phonetic_data->'tokens') AS phonetic
      wHERE NOT ARRAY[:values] @> ARRAY[phonetic]
    )
  )

  DEFAULT_SORT = { created_at: :desc }.freeze

  attr_accessor :record_class, :query

  def initialize(record_class)
    self.record_class = record_class
    self.query = record_class
  end

  def with_query(value)
    return self unless value.present?

    tokens = LanguageService.tokenize(value)
    self.query = query.where("phonetic_data ->'tokens' ?| array[:values]", values: tokens)
                      .order(Arel.sql(phonetic_score_query(tokens)))
    self
  end

  def with_filters(filters = [])
    return self unless filters.present?

    filters&.each do |filter|
      self.query = filter.not_filter ? query.where.not(filter.query) : query.where(filter.query)
    end

    self
  end

  def with_sort(sort = {})
    (sort || DEFAULT_SORT).each do |sort_field, direction|
      self.query = query.order(
        ActiveRecord::Base.sanitize_sql_for_order([Arel.sql("data->>? #{order_direction(direction)}"), [sort_field]])
      )
    end

    self
  end

  def phonetic_score_query(values)
    ActiveRecord::Base.sanitize_sql_for_conditions(
      ["(#{MATCHED_QUERY_COUNT} - #{MISMATCHED_QUERY_COUNT}) DESC", { values: }]
    )
  end

  def order_direction(order_direction)
    ActiveRecord::QueryMethods::VALID_DIRECTIONS.include?(order_direction) ? order_direction : :asc
  end

  def paginate(pagination = {})
    per = pagination&.dig(:per) || 10
    page = pagination&.dig(:page) || 1
    offset = (page - 1) * per

    self.query = query.limit(per).offset(offset)

    self
  end
end
