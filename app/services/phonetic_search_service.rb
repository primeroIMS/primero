# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A service that performs phonetic searches using SQL
class PhoneticSearchService
  attr_accessor :record_class, :search_params, :query

  class << self
    def search(record_class, search_params)
      new(record_class, search_params).search
    end

    def tokenize(value)
      value&.split&.map do |elem|
        diacriticless = LanguageService.strip_diacritics(elem)
        next(diacriticless.upcase) unless LanguageService.latin?(elem)

        Text::Metaphone.double_metaphone(diacriticless).first
      end
    end
  end

  def initialize(record_class, search_params)
    self.record_class = record_class
    self.search_params = with_defaults(search_params)
    self.query = record_class
  end

  def search
    with_phonetic_query
    with_filters
    with_order
    paginate
    query
  end

  def with_defaults(search_params)
    {
      filters: [], query_scope: {},
      sort: { created_at: :desc },
      pagination: {}
    }.merge(search_params || {})
  end

  def with_phonetic_query
    return unless search_params[:query].present?

    self.query = query.where("data ->'phonetic_search' ?| array[:values]", values: query_tokens)
                      .order(Arel.sql(phonetic_score_query(query_tokens)))
  end

  def with_filters
    search_params[:filters]&.each do |elem|
      filter = { 'attribute' => elem.keys.first, 'value' => elem.values.first }
      self.query = query.where(Reports::FilterFieldQuery.build(field: filter_fields[elem.keys.first], filter:))
    end
  end

  def filter_fields
    return @filter_fields if @filter_fields.present?

    field_names = search_params[:filters].map { |filter| filter.keys.first }
    @filter_fields = Field.where(name: field_names).each_with_object({}) do |field, memo|
      memo[field.name] = field
    end.with_indifferent_access
  end

  def query_tokens
    @query_tokens = self.class.tokenize(search_params[:query])
  end

  def with_order
    return unless search_params[:sort].present?

    search_params[:sort].each do |sort_field, order|
      self.query = query.order(
        ActiveRecord::Base.sanitize_sql_for_order([Arel.sql("data->>? #{order_direction(order)}"), [sort_field]])
      )
    end
  end

  def phonetic_score_query(values)
    ActiveRecord::Base.sanitize_sql_for_conditions(
      ["(#{matched_query_count} - #{mismatched_query_count}) DESC", { values: }]
    )
  end

  def order_direction(order_direction)
    ActiveRecord::QueryMethods::VALID_DIRECTIONS.include?(order_direction) ? order_direction : :asc
  end

  def matched_query_count
    %(
      (
        SELECT COUNT(phonetic) FROM JSONB_ARRAY_ELEMENTS_TEXT(data->'phonetic_search') AS phonetic
        WHERE ARRAY[:values] @> ARRAY[phonetic]
      )
    )
  end

  def mismatched_query_count
    %(
      (
        SELECT COUNT(phonetic) FROM JSONB_ARRAY_ELEMENTS_TEXT(data->'phonetic_search') AS phonetic
        wHERE NOT ARRAY[:values] @> ARRAY[phonetic]
      )
    )
  end

  def paginate
    per = search_params[:pagination]&.dig(:per) || 10
    page = search_params[:pagination]&.dig(:page) || 1
    offset = (page - 1) * per

    self.query = query.limit(per).offset(offset)
  end
end
