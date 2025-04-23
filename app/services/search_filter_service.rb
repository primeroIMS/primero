# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform a params hash into SearchFilters::SearchFiklter objects
class SearchFilterService
  EXCLUDED = %w[format controller action page per order order_by fields id_search].freeze
  FILTERABLE_MODELS = [Child, Incident, TracingRequest, RegistryRecord, Family].freeze

  class << self
    def build_filters(params, permitted_field_names)
      service = SearchFilterService.new
      filter_params = service.select_filter_params(params, permitted_field_names)
      filter_params = DestringifyService.destringify(filter_params.to_h, true)
      id_params = service.select_id_params(params)
      service.build_filters(filter_params.merge(id_params))
    end

    def boolean?(value)
      [TrueClass, FalseClass].any? { |klass| value.is_a?(klass) }
    end

    def range_class(value)
      if value['from'].is_a?(Numeric)
        SearchFilters::NumericRange
      elsif value['from'].respond_to?(:strftime)
        SearchFilters::DateRange
      end
    end
  end

  def build_filters(params)
    params.map { |key, value| build_filter(key, value) }.compact
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/PerceivedComplexity
  def build_filter(key, value)
    if key == 'id'
      build_id_filter(key, value)
    elsif key == 'or'
      build_or_filter(value)
    elsif key == 'not'
      SearchFilters::Not.new(filter: build_filter(value.keys.first, value.values.first))
    elsif key.starts_with?('loc:')
      build_location_filter(key, value)
    elsif value.is_a?(Hash)
      self.class.range_class(value)&.new(field_name: key, from: value['from'], to: value['to'])
    elsif value.is_a?(Array)
      build_array_filter(key, value)
    elsif SearchFilterService.boolean?(value)
      SearchFilters::BooleanValue.new(field_name: key, value:)
    elsif value.is_a?(String)
      SearchFilters::TextValue.new(field_name: key, value:)
    else
      SearchFilters::Value.new(field_name: key, value:)
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity

  def build_array_filter(field_name, value)
    if value.first.is_a?(Hash)
      build_range_list_filter(field_name, value)
    elsif SearchFilterService.boolean?(value.first)
      SearchFilters::BooleanList.new(field_name:, values: value)
    elsif value.first.is_a?(String)
      SearchFilters::TextList.new(field_name:, values: value)
    else
      SearchFilters::ValueList.new(field_name:, values: value)
    end
  end

  def build_range_list_filter(field_name, value)
    SearchFilters::RangeList.new(field_name:, values: value)
  end

  def build_location_filter(field_name, value)
    return SearchFilters::LocationList.new(field_name:, values: value) if value.is_a?(Array)

    SearchFilters::LocationValue.new(field_name:, value:)
  end

  def build_id_filter(field_name, value)
    return SearchFilters::IdListFilter.new(field_name:, values: value) if value.is_a?(Array)

    SearchFilters::IdFilter.new(field_name:, value:)
  end

  def build_or_filter(value)
    if value.is_a?(Array)
      SearchFilters::Or.new(filters: value.map { |v| build_filters(v).first })
    elsif value.is_a?(Hash)
      SearchFilters::Or.new(filters: build_filters(value))
    end
  end

  def select_filter_params(params, permitted_field_names)
    excluded_params = EXCLUDED + filterable_id_fields
    filter_params = params.except(*excluded_params)
    filter_params.select { |key, _| permitted_field_names.any? { |name| key.match?(/#{name}[0-5]?$/) } }
  end

  def select_id_params(params)
    params.select { |key, _| filterable_id_fields.include?(key) }
  end

  def filterable_id_fields
    @filterable_id_fields ||= FILTERABLE_MODELS.map(&:filterable_id_fields).flatten
  end
end
