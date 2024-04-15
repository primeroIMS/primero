# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value1,value2,... into a Sunspot query
class SearchFilters::ValueList < SearchFilters::SearchFilter
  attr_accessor :values

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Style/HashEachMethods
  def query_scope(sunspot)
    this = self
    sunspot.instance_eval do
      if this.values.first.is_a?(Hash)
        any_of do
          this.values.each do |v|
            with(this.field_name, v['from']...v['to'])
          end
        end
      else
        with(this.field_name).any_of(this.values)
      end
    end
  end
  # rubocop:enable Style/HashEachMethods
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  def query
    return unless values.present?

    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          (
            data->>:field_name IS NOT NULL AND (#{values_query})
          )
        ),
        { field_name:, values: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def values_query
    values.map do |value|
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ['data->:field_name @> TO_JSONB(:value)', { field_name:, value: }]
      )
    end.join(' OR ')
  end

  def as_location_filter(record_class)
    return self unless location_field_filter?(record_class)

    location_filters = values.map do |value|
      SearchFilters::Value.new(
        field_name: location_field_name_solr(field_name, value), value:
      )
    end
    SearchFilters::Or.new(filters: location_filters)
  end

  def location_field_filter?(record_class)
    record_class.searchable_location_fields.include?(field_name)
  end

  def as_id_filter(record_class)
    return self unless id_field_filter?(record_class)

    id_filters = values.map { |value| SearchFilters::Value.new(field_name: "#{field_name}_filterable", value:) }

    SearchFilters::Or.new(filters: id_filters)
  end

  def to_h
    {
      type: 'values',
      field_name:,
      value: values
    }
  end

  def to_s
    "#{field_name}=#{values&.join(',')}"
  end
end
