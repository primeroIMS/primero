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

  attr_accessor :record_class

  def self.search(record_class, query, scope = {})
    new(record_class).with_query(query).with_scope(scope)
  end

  def initialize(record_class)
    self.record_class = record_class
    @query = record_class
  end

  def with_query(value)
    return self unless value.present?

    tokens = LanguageService.tokenize(value)
    @query = @query.where("phonetic_data ->'tokens' ?| array[:values]", values: tokens)
                   .order(Arel.sql(phonetic_score_query(tokens)))
    self
  end

  def with_scope(scope)
    return self unless scope.present?

    with_user_scope(scope[:user])
    with_module_scope(scope[:module])

    self
  end

  def with_user_scope(user_scope)
    return self unless user_scope.present?

    if user_scope['user'].present?
      @query = @query.where("data->'associated_user_names' ? :user", user: user_scope['user'])
    elsif user_scope['agency'].present?
      @query = @query.where("data->'associated_user_agencies' ? :agency", agency: user_scope['agency'])
    elsif user_scope['group'].present?
      @query = @query.where("data->'associated_user_groups' ?| array[:groups]", groups: user_scope['group'])
    end

    self
  end

  def with_module_scope(module_scope)
    return self unless module_scope.present?

    @query = @query.where("data->'module_id' = :module_id", module_id: module_scope)
    self
  end

  def with_filters(filters = [])
    return self unless filters.present?

    filters&.each do |filter|
      @query = filter.not_filter ? @query.where.not(filter.query) : @query.where(filter.query)
    end

    self
  end

  def with_sort(sort = {})
    (sort || DEFAULT_SORT).each do |sort_field, direction|
      @query = @query.order(
        ActiveRecord::Base.sanitize_sql_for_order([Arel.sql("data->? #{order_direction(direction)}"), [sort_field]])
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
    per = pagination&.dig(:per_page) || 10
    page = pagination&.dig(:page) || 1
    offset = (page - 1) * per

    @query = @query.limit(per).offset(offset)

    self
  end

  def count
    @query.count
  end

  def results
    return @query if @query.is_a?(ActiveRecord::Relation)

    record_class.all
  end
end
