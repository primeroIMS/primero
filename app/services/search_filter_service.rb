# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform a params hash into SearchFilters::SearchFiklter objects
class SearchFilterService
  EXCLUDED = %w[format controller action page per order order_by fields id_search].freeze
  FILTERABLE_MODELS = [Child, Incident, TracingRequest, RegistryRecord, Family].freeze

  def self.build_filters(params, permitted_field_names)
    service = SearchFilterService.new
    destringify_service = DestringifyService.new
    filter_params = service.select_filter_params(params, permitted_field_names)
    filter_params = destringify_service.destringify(filter_params.to_h, true, true)
    id_params = service.select_id_params(params)
    id_params = destringify_service.destringify(id_params, true, false)
    service.build_filters(filter_params.merge(id_params))
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
        SearchFilters::NotValue.new(field_name: value.keys.first, values: value.values.first)
      elsif value.is_a?(Hash)
        if value['from'].is_a?(Numeric)
          SearchFilters::NumericRange.new(field_name: key, from: value['from'], to: value['to'])
        elsif value['from'].respond_to?(:strftime)
          SearchFilters::DateRange.new(field_name: key, from: value['from'], to: value['to'])
        end
      elsif value.is_a?(Array)
        SearchFilters::ValueList.new(field_name: key, values: value)
      else
        SearchFilters::Value.new(field_name: key, value:)
      end
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity

  def select_filter_params(params, permitted_field_names)
    excluded_params = EXCLUDED + filterable_id_fields
    filter_params = params.except(*excluded_params)
    filter_params.select { |key, _| permitted_field_names.any? { |name| key.match?(/#{name}[0-5]?$/) } }
  end

  def select_id_params(params)
    params.select { |key, _| filterable_id_fields.include?(key) }
  end

  def filterable_id_fields
    @filterable_id_fields = FILTERABLE_MODELS.map { |model| model.filterable_id_fields }.flatten
  end
end
