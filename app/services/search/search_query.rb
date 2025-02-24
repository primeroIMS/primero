# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A class to generate a SQL query
class Search::SearchQuery
  MATCHED_QUERY_COUNT = %(
    (
      SELECT COUNT(phonetic) FROM JSONB_ARRAY_ELEMENTS_TEXT(phonetic_data->'tokens') AS phonetic
      WHERE ARRAY[:values] @> ARRAY[phonetic]
    )
  )

  attr_accessor :record_class

  class << self
    def phonetic(record_class, query)
      new(record_class).phonetic(query)
    end

    def filter_ids(record_class, query)
      new(record_class).filter_ids(query)
    end
  end

  def initialize(record_class)
    self.record_class = record_class
    @query = record_class.eager_loaded_class
  end

  def phonetic(value)
    return self unless value.present?

    tokens = LanguageService.tokenize(value)
    order_query = ActiveRecord::Base.sanitize_sql_for_order(
      "#{phonetic_score_query(tokens)} #{similarity_score_query(value)}"
    )
    @query = @query.where("phonetic_data ->'tokens' ?| array[:values]", values: tokens)
                   .order(Arel.sql(order_query))
    self
  end

  def filter_ids(value)
    return self unless value.present?

    @query = @query.where(
      'id IN (:records)',
      records: SearchableIdentifier.select('record_id').where(record_type: record_class.name).where(
        'value ILIKE :value', value: "%#{ActiveRecord::Base.sanitize_sql_like(value&.strip)}%"
      )
    )

    self
  end

  def with_scope(scope)
    return self unless scope.present?

    @query = Search::SearchScope.apply(scope, @query)
    self
  end

  def with_filters(filters)
    return self unless filters.present?

    filters.each do |filter|
      @query = filter.not_filter ? @query.where.not(filter.query) : @query.where(filter.query)
    end

    self
  end

  def with_sort(sort)
    return self unless sort.present?

    sort.each do |sort_field, direction|
      field = ActiveRecord::Base.sanitize_sql_array(['data->?', sort_field])
      direction = order_direction(direction)
      order_query = ActiveRecord::Base.sanitize_sql_for_order("#{field} #{direction}")
      @query = @query.order(Arel.sql(order_query))
    end

    self
  end

  def result
    Search::SearchResult.new(@query)
  end

  private

  def phonetic_score_query(values)
    ActiveRecord::Base.sanitize_sql_for_conditions(["(#{MATCHED_QUERY_COUNT}) DESC", { values: }])
  end

  def similarity_score_query(value)
    record_class.phonetic_field_names.map do |field_name|
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ['WORD_SIMILARITY(data->>:field_name, :value) DESC', { field_name:, value: }]
      )
    end.join(', ')&.prepend(', ')
  end

  def order_direction(order_direction)
    ActiveRecord::QueryMethods::VALID_DIRECTIONS.include?(order_direction) ? order_direction : :asc
  end
end
