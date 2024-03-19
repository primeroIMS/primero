# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Superclass for all SearchFilter objects that transform API query parameters into Sunspot queries
class SearchFilters::SearchFilter < ValueObject
  OPERATORS = %w[= > < >= <=].freeze

  attr_accessor :field_name, :not_filter

  def initialize(args = {})
    super(args)
    @safe_operator = OPERATORS.include?(args[:operator]) ? args[:operator] : '='
  end

  def query
    raise NotImplementedError
  end

  def not_null_operator?
    @safe_operator == 'not_null'
  end

  def to_json(_obj)
    to_h.to_json
  end

  def as_location_filter(_record_class)
    self
  end

  def location_field_filter?(_record_class)
    false
  end

  def as_id_filter(_record_class)
    self
  end

  def id_field_filter?(record_class)
    record_class.filterable_id_fields.include?(field_name)
  end

  def location_field_name_solr(field_name, location_code)
    admin_level = LocationService.instance.find_by_code(location_code).admin_level
    "#{field_name}#{admin_level}"
  end
end
