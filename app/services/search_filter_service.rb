# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform a params hash into SearchFilters::SearchFiklter objects
class SearchFilterService
  EXCLUDED = %w[format controller action page per order order_by fields id_search].freeze

  class << self
    def build_filters(params, permitted_field_names, model_class)
      service = SearchFilterService.new
      filter_params = service.select_filter_params(params, permitted_field_names)
      filter_params = DestringifyService.destringify(filter_params.to_h, true)
      service.build_filters(filter_params, model_class)
    end

    def boolean?(value)
      [TrueClass, FalseClass].any? { |klass| value.is_a?(klass) }
    end
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/PerceivedComplexity
  # rubocop:disable Metrics/BlockLength
  def build_filters(params, model_class)
    params.map do |key, value|
      if key == 'or'
        if value.is_a?(Array)
          SearchFilters::Or.new(filters: value.map { |v| build_filters(v, model_class).first })
        elsif value.is_a?(Hash)
          SearchFilters::Or.new(filters: build_filters(value, model_class))
        end
      elsif key == 'not'
        build_not_filter(value.keys.first, value.values.first, model_class)
      elsif key == 'referred_users'
        SearchFilters::ReferredUsers.new(value:, record_type: model_class.name)
      elsif key == 'transferred_to_users'
        SearchFilters::TransferredToUsers.new(value:, record_type: model_class.name)
      elsif key == 'transferred_to_user_groups'
        SearchFilters::TransferredToUserGroups.new(values: value, record_type: model_class.name)
      elsif key == 'referred_users_present'
        SearchFilters::ReferredUsersPresent.new(value:, record_type: model_class.name)
      elsif key.starts_with?('loc:')
        build_location_filter(key, value)
      elsif value.is_a?(Hash)
        if value['from'].is_a?(Numeric)
          SearchFilters::NumericRange.new(field_name: key, from: value['from'], to: value['to'])
        elsif value['from'].respond_to?(:strftime)
          SearchFilters::DateRange.new(field_name: key, from: value['from'], to: value['to'])
        end
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
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity
  # rubocop:enable Metrics/BlockLength

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
  def build_not_filter(field_name, value, model_class)
    if field_name.starts_with?('loc:')
      build_location_filter(field_name, value, true)
    elsif field_name == 'referred_users'
      SearchFilters::ReferredUsers.new(value:, record_type: model_class.name, not_filter: true)
    elsif field_name == 'transferred_to_users'
      SearchFilters::TransferredToUsers.new(value:, record_type: model_class.name, not_filter: true)
    elsif field_name == 'transferred_to_user_groups'
      SearchFilters::TransferredToUserGroups.new(values: value, record_type: model_class.name, not_filter: true)
    elsif field_name == 'referred_users_present'
      SearchFilters::ReferredUsersPresent.new(value:, record_type: model_class.name, not_filter: true)
    elsif value.is_a?(Array)
      build_array_filter(field_name, value, true)
    elsif SearchFilterService.boolean?(value)
      SearchFilters::BooleanValue.new(field_name:, value:, not_filter: true)
    elsif value.is_a?(String)
      SearchFilters::TextValue.new(field_name:, value:, not_filter: true)
    else
      SearchFilters::Value.new(field_name:, value:, not_filter: true)
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/PerceivedComplexity

  def build_array_filter(field_name, value, not_filter = false)
    if value.first.is_a?(Hash)
      build_range_list_filter(field_name, value, not_filter)
    elsif SearchFilterService.boolean?(value.first)
      SearchFilters::BooleanList.new(field_name:, values: value, not_filter:)
    elsif value.first.is_a?(String)
      SearchFilters::TextList.new(field_name:, values: value, not_filter:)
    else
      SearchFilters::ValueList.new(field_name:, values: value, not_filter:)
    end
  end

  def build_range_list_filter(field_name, value, not_filter = false)
    if value.first['from'].is_a?(Numeric)
      SearchFilters::RangeList.new(field_name:, values: value, range_type: SearchFilters::NumericRange, not_filter:)
    elsif value.first['from'].respond_to?(:strftime)
      SearchFilters::RangeList.new(field_name:, values: value, range_type: SearchFilters::DateRange, not_filter:)
    else
      raise(Errors::InvalidPrimeroEntityType, 'Filter is not valid')
    end
  end

  def build_location_filter(field_name, value, not_filter = false)
    return SearchFilters::LocationList.new(field_name:, values: value, not_filter:) if value.is_a?(Array)

    SearchFilters::LocationValue.new(field_name:, value:, not_filter:)
  end

  def select_filter_params(params, permitted_field_names)
    filter_params = params.except(*EXCLUDED)
    filter_params.select { |key, _| permitted_field_names.any? { |name| key.match?(/#{name}[0-5]?$/) } }
  end
end
