# frozen_string_literal: true

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
        SearchFilters::Value.new(field_name: key, value: value)
      end
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity

  def select_filter_params(params, permitted_field_names)
    filter_params = params.reject { |key, _| EXCLUDED.include?(key) }
    filter_params.select { |key, _| permitted_field_names.any? { |name| key.match?(/#{name}[0-5]?$/) } }
  end
end
