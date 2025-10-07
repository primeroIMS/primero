# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A class to generate a SQL query for a phonetic search
class Search::PhoneticSearchQuery < Search::SearchQuery
  attr_accessor :tokens

  MATCHED_QUERY_COUNT = %(
    (
      SELECT COUNT(phonetic) FROM JSONB_ARRAY_ELEMENTS_TEXT(phonetic_data->'tokens') AS phonetic
      WHERE ARRAY[:tokens] @> ARRAY[phonetic]
    )
  )

  def build
    record_query = super
    return record_query unless query.present?

    self.tokens = LanguageService.tokenize(query)
    record_query.where("phonetic_data ->'tokens' ?| array[:values]", values: tokens)
                .order(Arel.sql(order_query))
  end

  private

  def order_query
    ActiveRecord::Base.sanitize_sql_for_order("#{phonetic_score_query} #{similarity_score_query}")
  end

  def phonetic_score_query
    ActiveRecord::Base.sanitize_sql_for_conditions(["(#{MATCHED_QUERY_COUNT}) DESC", { tokens: }])
  end

  def similarity_score_query
    record_class.phonetic_field_names.map do |field_name|
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ['WORD_SIMILARITY(data->>:field_name, :query) DESC', { field_name:, query: }]
      )
    end.join(', ')&.prepend(', ')
  end
end
