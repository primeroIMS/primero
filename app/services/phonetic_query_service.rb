# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A service that performs phonetic searches using SQL
class PhoneticQueryService
  PHONETIC_FIELD_NAMES = %w[
    name name_nickname name_other relation_name relation_nickname relation_other_family tracing_names tracing_nicknames
  ].freeze

  class << self
    def search(record_class, search_params)
      # TODO: Default pagination
      return record_class.limit(10) unless search_params.present?

      query = paginate(record_class, search_params[:paginate])
      with_filters(query, search_params)
      # with_query_scope(record_class, search_params[:query_scope])
      # paginate(search_params[:paginate])
    end

    def with_filters(query, params)
      query = query.where(filter_query(params.keys.first, params.values.first))
      params.drop(1).each do |(key, value)|
        binding.pry
        query = query.or(query.where(filter_query(key, value)))
      end
      query
    end

    def paginate(record_class, pagination = {})
      per = pagination&.dig(:per) || 10
      page = pagination&.dig(:page) || 1
      offset = (page - 1) * per
      record_class.limit(per).offset(offset)
    end

    def with_defaults(search_params)
      {
        filters: [], query_scope: {},
        sort: { created_at: :desc },
        pagination: {}
      }.merge(search_params)
    end

    def quoted_column_name(column_name)
      ActiveRecord::Base.connection.quote_column_name(column_name)
    end

    def filter_query(field_name, value)
      return phonetic_filter_query(field_name, value) if PHONETIC_FIELD_NAMES.include?(field_name)

      field_filter_query(field_name, value)
    end

    # rubocop:disable Metrics/MethodLength
    def phonetic_filter_query(field_name, value)
      tokenized_field_name = quoted_column_name("tokenized_#{field_name}")
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            (SELECT
               DMETAPHONE(:value) = ANY(
                 ARRAY_AGG(DMETAPHONE(#{tokenized_field_name}))
               )
             FROM
               UNNEST(REGEXP_SPLIT_TO_ARRAY(data->>:field_name, '\s')) AS #{tokenized_field_name}
            ) = TRUE
          ),
          { field_name:, value: }
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength

    def field_filter_query(field_name, value)
      ActiveRecord::Base.sanitize_sql_for_conditions(['data->>:field_name = :value', { field_name:, value: }])
    end
  end
end
