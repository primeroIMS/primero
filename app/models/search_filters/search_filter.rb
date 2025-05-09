# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Superclass for all SearchFilter objects that transform API query parameters into sql queries
class SearchFilters::SearchFilter < ValueObject
  OPERATORS = %w[= > < >= <=].freeze

  attr_accessor :field_name, :json_column, :table_name

  def initialize(args = {})
    super(args)
    @safe_operator = OPERATORS.include?(args[:operator]) ? args[:operator] : '='
    self.json_column = args[:json_column] || 'data'
    self.table_name = args[:table_name] || ''
  end

  def safe_json_column
    return ActiveRecord::Base.sanitize_sql_for_conditions(['%s', json_column]) unless table_name.present?

    ActiveRecord::Base.sanitize_sql_for_conditions(['%s.%s', table_name, json_column])
  end

  def json_field_query
    ActiveRecord::Base.sanitize_sql_for_conditions(['$.%s', field_name])
  end

  def safe_search_column
    return ActiveRecord::Base.sanitize_sql_for_conditions(['%s', searchable_field_name]) unless table_name.present?

    ActiveRecord::Base.sanitize_sql_for_conditions(['%s.%s', table_name, searchable_field_name])
  end

  def query(record_class = nil)
    return searchable_query(record_class) if searchable_field_name?(record_class)

    json_path_query
  end

  def json_path_query
    raise NotImplementedError
  end

  def searchable_query
    raise NotImplementedError
  end

  def searchable_field_name
    "srch_#{field_name}"
  end

  def searchable_field_name?(record_class)
    return false unless record_class.present?

    record_class.searchable_field_name?(field_name)
  end

  def array_field?(record_class)
    return false unless record_class.present?

    record_class.columns_hash["srch_#{field_name}"].array
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
