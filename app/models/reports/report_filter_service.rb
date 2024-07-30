# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform report filters to search filters
class Reports::ReportFilterService
  attr_accessor :filters, :filters_map, :destringify_service

  class << self
    def build_filters(filters, filters_map)
      service = Reports::ReportFilterService.new(filters, filters_map)
      service.build_filters
    end
  end

  def initialize(filters, filters_map)
    self.filters = filters
    self.filters_map = filters_map
    self.destringify_service = DestringifyService.new
  end

  # rubocop:disable Metrics/AbcSize
  def build_filters
    filters.map do |filter|
      field = filters_map[filter['attribute']]
      filter = filter.merge('value' => destringify_service.destringify(filter['value'], false))
      next(SearchFilters::NotNull.new(field_name: filter['attribute'])) if filter['constraint'] == 'not_null'
      next(build_location_filter(filter, field)) if field.location? || field.reporting_location?
      next(build_array_filter(filter, field)) if filter['value'].is_a?(Array) && filter['value'].size >= 1

      build_filter(filter, field)
    end
  end
  # rubocop:enable Metrics/AbcSize

  # rubocop:disable Metrics/MethodLength
  def build_filter(filter, field)
    case field.type
    when Field::DATE_FIELD
      SearchFilters::DateValue.new(
        field_name: filter['attribute'], value: filter['value'], operator: filter['constraint'],
        date_include_time: field.date_include_time
      )
    when Field::TICK_BOX, Field::RADIO_BUTTON
      SearchFilters::BooleanValue.new(field_name: filter['attribute'], value: filter['value'])
    when Field::NUMERIC_FIELD
      SearchFilters::Value.new(field_name: filter['attribute'], value: filter['value'], operator: filter['constraint'])
    else
      SearchFilters::TextValue.new(field_name: filter['attribute'], value: filter['value'])
    end
  end
  # rubocop:enable Metrics/MethodLength

  def build_array_filter(filter, field)
    case field.type
    when Field::TICK_BOX, Field::RADIO_BUTTON
      SearchFilters::BooleanList.new(field_name: filter['attribute'], values: filter['value'])
    when Field::NUMERIC_FIELD
      SearchFilters::ValueList.new(field_name: filter['attribute'], values: filter['value'])
    else
      SearchFilters::TextList.new(field_name: filter['attribute'], values: filter['value'])
    end
  end

  def build_location_filter(filter, field)
    if filter['value'].is_a?(Array) && filter['value'].size >= 1
      return SearchFilters::LocationList.new(field_name: field.name, values: filter['value'])
    end

    SearchFilters::Location.new(field_name: field.name, value: filter['value'])
  end
end
