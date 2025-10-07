# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for location filters
module SearchFilters::Location
  extend ActiveSupport::Concern

  def filter_record_location(record_class)
    return "#{safe_search_column} @> descendants.location_code" if array_field?(record_class)

    "#{safe_search_column} = descendants.location_code"
  end

  def admin_level
    return 0 unless field_name.last.match?(Field::ADMIN_LEVEL_REGEXP)

    field_name.last.to_i
  end

  def record_field_name
    Field.remove_location_parts(field_name)
  end

  def searchable_field_name
    "srch_#{record_field_name}"
  end

  def searchable_field_name?(record_class)
    return false unless record_class.present?

    record_class.searchable_field_name?(record_field_name)
  end

  def array_field?(record_class)
    return false unless record_class.present?

    record_class.columns_hash["srch_#{record_field_name}"].array
  end
end
