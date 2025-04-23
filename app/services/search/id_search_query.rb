# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A class to generate a SQL query for id search
class Search::IdSearchQuery < Search::SearchQuery
  attr_accessor :sort

  def build
    record_query = super
    record_query = apply_sort(record_query)
    return record_query unless query.present?

    record_query.where(
      'id IN (:records)',
      records: SearchableIdentifier.select('record_id').where(record_type: record_class.name).where(
        'value ILIKE :value', value: "%#{ActiveRecord::Base.sanitize_sql_like(query&.strip)}%"
      )
    )
  end

  def with_sort(sort)
    self.sort = sort
    self
  end

  private

  def apply_sort(record_query)
    return record_query unless sort.present?

    sort.each do |(sort_field, direction)|
      record_query = if record_class.searchable_field_names.include?(sort_field)
                       apply_searchable_sort(record_query, sort_field, direction)
                     else
                       apply_data_sort(record_query, sort_field, direction)
                     end
    end

    record_query
  end

  def apply_searchable_sort(record_query, sort_field, direction)
    field = ActiveRecord::Base.sanitize_sql_array(['%s', "srch_#{sort_field}"])
    direction = order_direction(direction)
    order_query = ActiveRecord::Base.sanitize_sql_for_order("#{field} #{direction}")
    record_query.order(Arel.sql(order_query))
  end

  def apply_data_sort(record_query, sort_field, direction)
    field = ActiveRecord::Base.sanitize_sql_array(['data->?', sort_field])
    direction = order_direction(direction)
    order_query = ActiveRecord::Base.sanitize_sql_for_order("#{field} #{direction}")
    record_query.order(Arel.sql(order_query))
  end

  def order_direction(order_direction)
    ActiveRecord::QueryMethods::VALID_DIRECTIONS.include?(order_direction) ? order_direction : :asc
  end
end
