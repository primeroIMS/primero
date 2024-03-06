# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A service that performs phonetic searches using SQL
class PhoneticSearchService
  DEFAULT_SEARCH_PARAMS = {
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
    self.search_params = DEFAULT_SEARCH_PARAMS.merge(search_params)
  end

  def search
    search_query.with_scope(search_params[:scope])
                .with_filters(search_params[:filters])
                .with_sort(search_params[:sort])
                .result
                .paginate(search_params[:pagination])
  end

  def phonetic?
    search_params[:phonetic] == 'true'
  end

  private

  def search_query
    return SearchQuery.phonetic(record_class, search_params[:query]) if phonetic?

    SearchQuery.filter_ids(record_class, search_params[:query])
  end

  # A class that stores the results of a phonetic search
  class SearchResult
    DEFAULT_PER_PAGE = 10
    DEFAULT_PAGE = 1

    attr_accessor :total

    def initialize(query)
      @query = query
      self.total = @query.count
    end

    def records
      @query
    end

    def paginate(pagination)
      return self unless pagination.present?

      per = pagination[:per_page] || DEFAULT_PER_PAGE
      page = pagination[:page] || DEFAULT_PAGE
      offset = (page - 1) * per

      @query = @query.limit(per).offset(offset)

      self
    end
  end

  # A class to generate a SQL query
  class SearchQuery
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

    attr_accessor :klass

    class << self
      def phonetic(klass, query)
        new(klass).phonetic(query)
      end

      def filter_ids(klass, query)
        new(klass).filter_ids(query)
      end
    end

    def initialize(klass)
      self.klass = klass
      @query = klass.eager_loaded_class
    end

    def phonetic(value)
      return self unless value.present?

      tokens = LanguageService.tokenize(value)
      @query = @query.where("phonetic_data ->'tokens' ?| array[:values]", values: tokens)
                     .order(Arel.sql(phonetic_score_query(tokens)))
      self
    end

    def filter_ids(value)
      return self unless value.present?

      filterable_id_queries = klass.filterable_id_fields.map do |id_field|
        ActiveRecord::Base.sanitize_sql_for_conditions(
          ['data->>:id_field ILIKE :value', { id_field:, value: "#{ActiveRecord::Base.sanitize_sql_like(value)}%" }]
        )
      end

      @query = @query.where("(#{filterable_id_queries.join(' OR ')})")
      self
    end

    def with_scope(scope)
      return self unless scope.present?

      @query = with_user_scope(scope[:user])
      @query = with_module_scope(scope[:module])
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
        @query = @query.order(
          ActiveRecord::Base.sanitize_sql_for_order([Arel.sql("data->? #{order_direction(direction)}"), [sort_field]])
        )
      end

      self
    end

    def result
      SearchResult.new(@query)
    end

    private

    def with_user_scope(user_scope)
      return @query unless user_scope.present?

      if user_scope['user'].present?
        @query.where("data->'associated_user_names' ? :user", user: user_scope['user'])
      elsif user_scope['agency'].present?
        @query.where("data->'associated_user_agencies' ? :agency", agency: user_scope['agency'])
      elsif user_scope['group'].present?
        @query.where("data->'associated_user_groups' ?| array[:groups]", groups: user_scope['group'])
      else
        @query
      end
    end

    def with_module_scope(module_scope)
      return @query unless module_scope.present?

      @query.where("data->>'module_id' = :module_id", module_id: module_scope)
    end

    def phonetic_score_query(values)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ["(#{MATCHED_QUERY_COUNT} - #{MISMATCHED_QUERY_COUNT}) DESC", { values: }]
      )
    end

    def order_direction(order_direction)
      ActiveRecord::QueryMethods::VALID_DIRECTIONS.include?(order_direction) ? order_direction : :asc
    end
  end
end
