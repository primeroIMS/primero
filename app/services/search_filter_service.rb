# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform a params hash into SearchFilters::SearchFiklter objects
class SearchFilterService
  EXCLUDED = %w[format controller action page per order order_by fields id_search].freeze

  def self.build_filters(params, permitted_field_names)
    service = SearchFilterService.new
    filter_params = service.select_filter_params(params, permitted_field_names)
    filter_params = DestringifyService.destringify(filter_params.to_h, true)
    service.build_filters(filter_params)
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/PerceivedComplexity
  def build_filters(params)
    params.map do |key, value|
      if key == 'or'
        if value.is_a?(Array)
          SearchFilters::Or.new(filters: value.map { |v| build_filters(v).first })
        elsif value.is_a?(Hash)
          SearchFilters::Or.new(filters: build_filters(value))
        end
      elsif key == 'not'
        build_filter(value.keys.first, value.values.first, true)
      elsif value.is_a?(Hash)
        if value['from'].is_a?(Numeric)
          SearchFilters::NumericRange.new(field_name: key, from: value['from'], to: value['to'])
        elsif value['from'].respond_to?(:strftime)
          SearchFilters::DateRange.new(field_name: key, from: value['from'], to: value['to'])
        end
      else
        build_filter(key, value)
      end
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity

  def build_filter(field_name, value, not_filter = false)
    # TODO: Assumes everything is of the same type but we really need to either validate or cast types.
    filter_value = value.is_a?(Array) ? value.first : value

    if filter_value.is_a?(Numeric)
      SearchFilters::NumericValue.new(field_name:, value:, not_filter:)
    elsif [TrueClass, FalseClass].any? { |boolean_klass| filter_value.is_a?(boolean_klass) }
      SearchFilters::BooleanValue.new(field_name:, value:, not_filter:)
    else
      SearchFilters::Value.new(field_name:, value:, not_filter:)
    end
  end

  def select_filter_params(params, permitted_field_names)
    filter_params = params.except(*EXCLUDED)
    filter_params.select { |key, _| permitted_field_names.any? { |name| key.match?(/#{name}[0-5]?$/) } }
  end
end
