# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Represents a query against a numeric field
class Reports::FieldQueries::NumericFieldQuery < Reports::FieldQueries::FieldQuery
  attr_accessor :range, :abrreviate_range

  def to_sql
    return range_query if range.present?

    "#{sort_query}, #{default_query}"
  end

  def range_query
    last_range = range.last
    %(
      #{sort_query},
      case #{range.map { |range| build_range(field, range, last_range == range) }.join}
      end as #{column_alias}
    )
  end

  def sort_query
    if range.present?
      return %(
        case #{range.map.with_index { |range, index| build_range_order(field, range, index) }.join(' ')}
        end as #{sort_alias}
      )
    end

    ActiveRecord::Base.sanitize_sql_array(["data->'%s' as %s", record_field_name, sort_alias])
  end

  def generate_sort_alias
    "#{column_alias}_srt"
  end

  def build_range_order(field, range, index)
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "when int4range(:start, :end, '[]') @> cast(#{data_column_name}->> :field_name as integer) then :index",
        { field_name: field.name, start: range.first, end: range.last, index: }
      ]
    )
  end

  def build_range(field, range, is_last_range)
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %{
          when int4range(:start, :end, '[]') @> cast(#{data_column_name}->> :field_name as integer)
          then #{is_last_range && abrreviate_range ? "':start+'" : "':start - :end'"}
        },
        { field_name: field.name, start: range.first, end: range.last }
      ]
    )
  end
end
