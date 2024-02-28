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

  DEFAULT_PARAMS = {
    filters: [],
    scope: {},
    sort: { created_at: :desc },
    pagination: {},
    phonetic: false
  }.freeze

  attr_accessor :record_class, :search_params

  def self.search(record_class, search_params = {})
    new(record_class, search_params).search
  end

  def initialize(record_class, search_params)
    self.record_class = record_class
    self.search_params = DEFAULT_PARAMS.merge(search_params)
  end

  def search
    query = with_query
    query = with_scope(query)
    query = with_filters(query)
    query = with_sort(query)

    SearchResult.new(total: query.count, records: paginate(query))
  end

  private

  def with_query
    return record_class.all unless search_params[:query].present?

    phonetic? ? phonetic_query : filterable_ids_query
  end

  def phonetic?
    search_params[:phonetic] == true
  end

  def phonetic_query
    return unless search_params[:query].present?

    tokens = LanguageService.tokenize(search_params[:query])
    record_class.where("phonetic_data ->'tokens' ?| array[:values]", values: tokens)
                .order(Arel.sql(phonetic_score_query(tokens)))
  end

  def filterable_ids_query
    return unless search_params[:query].present?

    filterable_id_queries = record_class.filterable_id_fields.map do |id_field|
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          'data->>:id_field ILIKE :value',
          { id_field:, value: "#{ActiveRecord::Base.sanitize_sql_like(search_params[:query])}%" }
        ]
      )
    end

    record_class.where("(#{filterable_id_queries.join(' OR ')})")
  end

  def with_scope(query)
    return query unless search_params[:scope].present?

    query = with_user_scope(query, search_params.dig(:scope, :user))
    with_module_scope(query, search_params.dig(:scope, :module))
  end

  def with_user_scope(query, user_scope)
    return query unless user_scope.present?

    if user_scope['user'].present?
      query.where("data->'associated_user_names' ? :user", user: user_scope['user'])
    elsif user_scope['agency'].present?
      query.where("data->'associated_user_agencies' ? :agency", agency: user_scope['agency'])
    elsif user_scope['group'].present?
      query.where("data->'associated_user_groups' ?| array[:groups]", groups: user_scope['group'])
    end
  end

  def with_module_scope(query, module_scope)
    return query unless module_scope.present?

    query.where("data->'module_id' = :module_id", module_id: module_scope)
  end

  def with_filters(query)
    return query unless search_params[:filters].present?

    search_params[:filters].each do |filter|
      query = filter.not_filter ? query.where.not(filter.query) : query.where(filter.query)
    end

    query
  end

  def with_sort(query)
    return query unless search_params[:sort].present?

    search_params[:sort].each do |sort_field, direction|
      query = query.order(
        ActiveRecord::Base.sanitize_sql_for_order([Arel.sql("data->? #{order_direction(direction)}"), [sort_field]])
      )
    end

    query
  end

  def paginate(query)
    return query unless search_params[:pagination].present?

    per = search_params.dig(:pagination, :per_page) || 10
    page = search_params.dig(:pagination, :page) || 1
    offset = (page - 1) * per

    query.limit(per).offset(offset)
  end

  def phonetic_score_query(values)
    ActiveRecord::Base.sanitize_sql_for_conditions(
      ["(#{MATCHED_QUERY_COUNT} - #{MISMATCHED_QUERY_COUNT}) DESC", { values: }]
    )
  end

  def order_direction(order_direction)
    ActiveRecord::QueryMethods::VALID_DIRECTIONS.include?(order_direction) ? order_direction : :asc
  end

  # A class that stores the results of a phonetic search
  class SearchResult < ValueObject
    attr_accessor :total, :records
  end
end
