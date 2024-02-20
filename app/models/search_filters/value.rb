# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a Sunspot query
class SearchFilters::Value < SearchFilters::SearchFilter
  attr_accessor :field_name, :value

  def query_scope(sunspot)
    this = self
    sunspot.instance_eval do
      with(this.field_name, this.value)
    end
  end

  # rubocop:disable Metrics/MethodLength
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          (
            (
              JSONB_TYPEOF(data->:field_name) = 'array'
              AND EXISTS (
                  SELECT
                    1
                  FROM JSONB_ARRAY_ELEMENTS(data->:field_name) AS array_field
                  WHERE array_field #{@safe_operator} TO_JSONB(:value)
              )
            ) OR (
               JSONB_TYPEOF(data->:field_name) != 'array'
               AND data->:field_name #{@safe_operator} TO_JSONB(:value)
             )
          )
        ),
        { field_name:, value: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def as_location_filter(record_class)
    return self unless location_field_filter?(record_class)

    clone.tap do |f|
      f.field_name = location_field_name_solr(field_name, value)
    end
  end

  def location_field_filter?(record_class)
    record_class.searchable_location_fields.include?(field_name)
  end

  def as_id_filter(record_class)
    return self unless id_field_filter?(record_class)

    clone.tap do |f|
      f.field_name = "#{field_name}_filterable"
    end
  end

  def to_h
    {
      type: 'value',
      field_name:,
      value:
    }
  end

  def to_s
    "#{field_name}=#{value}"
  end
end
