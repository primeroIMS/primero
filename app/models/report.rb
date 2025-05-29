# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Configurable reports for aggregating data over Primero records.
# rubocop:disable Metrics/ClassLength
class Report < ApplicationRecord
  include LocalizableJsonProperty
  include ConfigurationRecord

  REPORTABLE_FIELD_TYPES = [
    # Field::TEXT_FIELD,
    # Field::TEXT_AREA,
    Field::RADIO_BUTTON,
    Field::SELECT_BOX,
    Field::NUMERIC_FIELD,
    Field::DATE_FIELD,
    # Field::DATE_RANGE,
    Field::TICK_BOX,
    Field::TALLY_FIELD
  ].freeze

  AGGREGATE_COUNTS_FIELD_TYPES = [
    Field::NUMERIC_FIELD,
    Field::TALLY_FIELD
  ].freeze

  AGE = 'age'
  DAY = 'date' # eg. 13-Jan-2015
  WEEK = 'week' # eg. Week 2 Jan-2015
  MONTH = 'month' # eg. Jan-2015
  YEAR = 'year' # eg. 2015
  DATE_RANGES = [DAY, WEEK, MONTH, YEAR].freeze
  DATE_FORMAT = 'YYYY-MM-DD'
  DATE_TIME_FORMAT = 'YYYY-MM-DD"T"HH24:MI:SS'

  localize_properties :name, :description

  # TODO: Currently it's not worth trying to save off the report data.
  #      The report builds a value hash with an array of strings as keys. CouchDB/CouchRest converts this array to
  #      a string. Not clear what benefit could be gained by storing the data but converting keys to strings on the fly
  #      when rendering the graph and table. So for now we will rebuild the data.
  attr_accessor :data
  attr_accessor :add_default_filters, :aggregate_by_ordered, :disaggregate_by_ordered, :permission_filter

  self.unique_id_from_attribute = 'name_en'

  alias_attribute :graph, :is_graph

  validates :record_type, presence: true
  validates :aggregate_by, presence: true
  validate :validate_modules_present
  validate :validate_name_in_base_language

  before_create :generate_unique_id
  before_save :apply_default_filters

  def self.new_with_properties(report_params)
    report = Report.new(report_params.except(:name, :description, :fields))
    report.name_i18n = report_params[:name]
    report.description_i18n = report_params[:description]
    report.aggregate_by = ReportFieldService.aggregate_by_from_params(report_params)
    report.disaggregate_by = ReportFieldService.disaggregate_by_from_params(report_params)
    report
  end

  def validate_name_in_base_language
    return if name_en.present?

    errors.add(:name, I18n.t('errors.models.report.name_presence'))
  end

  def update_properties(report_params)
    report_params = report_params.with_indifferent_access if report_params.is_a?(Hash)
    converted_params = FieldI18nService.convert_i18n_properties(Report, report_params)
    merged_props = FieldI18nService.merge_i18n_properties(attributes, converted_params)
    assign_attributes(report_params.except(:name, :description, :fields).merge(merged_props))
    return unless report_params[:fields]

    self.aggregate_by = ReportFieldService.aggregate_by_from_params(report_params)
    self.disaggregate_by = ReportFieldService.disaggregate_by_from_params(report_params)
  end

  def modules
    @modules ||= PrimeroModule.all(keys: [module_id]).all if module_id.present?
  end

  def build_report
    results = ActiveRecord::Base.connection.execute(build_query).to_a
    self.data = results.each_with_object({}) { |result, acc| write_result(result, acc) }
  end

  def write_result(result, data_hash)
    field_queries.reduce(data_hash) do |acc, field_query|
      fill_lookup_rows(acc, field_query.field) unless exclude_empty_rows?
      value = result[field_query.column_name.delete('"')]
      break if value.blank?

      write_field_data(acc, value, result)
    end
  end

  def write_field_data(field_hash, value, result)
    if field_hash[value].present?
      field_hash[value]['_total'] += result['total']
    else
      field_hash[value] = { '_total' => result['total'] }
    end

    field_hash[value]
  end

  def fill_lookup_rows(field_acc, field)
    lookup_values = field.options_list(locale: I18n.locale, lookups:)
    return unless lookup_values.is_a?(Array)

    lookup_values&.each do |lookup_value|
      next unless field_acc[lookup_value['id']].blank?

      field_acc[lookup_value['id']] = { '_total' => 0 }
    end
  end

  def lookups
    sources = pivots_map.values.each_with_object([]) do |(field), acc|
      acc << field.option_strings_source.split.last if field.option_strings_source.present?
    end

    @lookups ||= Lookup.where(unique_id: sources)
  end

  def model
    @model ||= PrimeroModelService.to_model(record_type)
  end

  def build_query
    query = model.try(:parent_record_type).present? ? join_nested_model : model
    query = select_fields(query)
    query = apply_filters(query)
    query = query.group(group_by_fields)
    query = query.order(sort_fields)
    query.to_sql
  end

  def join_nested_model
    model.parent_record_type.joins(
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ["CROSS JOIN jsonb_array_elements(data->'%s') as %s", model.record_field_name, model.record_field_name]
      )
    )
  end

  def group_by_fields
    (sort_fields + column_names).uniq
  end

  def column_names
    @column_names ||= field_queries.map(&:column_name)
  end

  def sort_fields
    @sort_fields ||= field_queries.map(&:sort_field)
  end

  def field_queries
    @field_queries ||= pivots_map.entries.map do |(pivot, field)|
      next(build_date_field_query(field)) if field.type == Field::DATE_FIELD
      next(build_numeric_field_query(field)) if field.type == Field::NUMERIC_FIELD

      if field.type == Field::SELECT_BOX && field.option_strings_source == 'Location'
        next(build_location_field_query(field, pivot))
      end

      build_field_query(field)
    end
  end

  def build_location_field_query(field, pivot)
    Reports::FieldQueries::LocationFieldQuery.new(
      field:, record_field_name: record_field_name(field), admin_level: pivot&.last.to_i
    )
  end

  def build_date_field_query(field)
    Reports::FieldQueries::DateFieldQuery.new(
      record_field_name: record_field_name(field), field:, group_by: group_dates_by
    )
  end

  def primary_age_ranges
    module_age_ranges = PrimeroModule.age_ranges(module_id)
    return module_age_ranges if module_age_ranges.present?

    SystemSettings.primary_age_ranges
  end

  def build_numeric_field_query(field)
    args = { field:, record_field_name: record_field_name(field) }

    args = args.merge(range: primary_age_ranges, abrreviate_range: true) if age_field?(field) && group_ages?

    Reports::FieldQueries::NumericFieldQuery.new(args)
  end

  def build_field_query(field)
    Reports::FieldQueries::FieldQuery.new(field:, record_field_name: record_field_name(field))
  end

  def record_field_name(field)
    record_field_name = model.try(:record_field_name)
    return unless record_field_name.present?
    return if model.parent_record_type.minimum_reportable_fields.values.flatten.include?(field.name)

    record_field_name
  end

  def apply_filters(query)
    filter_query = query
    if model.try(:parent_record_type).present?
      filter_query = apply_filters_for_nested_model(filter_query)
    else
      search_filters = Reports::ReportFilterService.build_filters(filters, filters_map)
      search_filters.each { |filter| filter_query = filter_query.where(filter.query) }
    end

    filter_query = apply_permission_filter(filter_query)
    apply_module_filter(filter_query)
  end

  def apply_filters_for_nested_model(query)
    filters.reduce(query) do |current_query, filter|
      field = filter_fields[filter['attribute']]
      current_query.where(
        Reports::FilterFieldQuery.build(field:, filter:, record_field_name: record_field_name(field))
      )
    end
  end

  def apply_permission_filter(query)
    return query unless permission_filter.present?

    query.where(Reports::FilterFieldQuery.build(permission_filter:))
  end

  def apply_module_filter(query)
    query.where(srch_module_id: module_id)
  end

  def age_field?(field)
    field.type == Field::NUMERIC_FIELD && field.name.starts_with?(AGE)
  end

  def validate_modules_present
    if module_id.present? && module_id.length >= 1
      if module_id.split('-').first != 'primeromodule'
        errors.add(:module_id, I18n.t('errors.models.report.module_syntax'))
      end
    else
      errors.add(:module_id, I18n.t('errors.models.report.module_presence'))
    end
  end

  def apply_default_filters
    return unless add_default_filters

    self.filters ||= []
    default_filters = model.report_filters
    self.filters = (self.filters + default_filters).uniq
  end

  def pivots_map
    @pivots_map ||= build_fields_map(pivots, pivot_fields)
  end

  def pivot_fields
    @pivot_fields ||= fields_by_name(pivots)
  end

  def pivots
    (aggregate_by || []) + (disaggregate_by || [])
  end

  def filters_map
    @filters_map ||= build_fields_map(filter_attributes, filter_fields)
  end

  def filter_fields
    @filter_fields ||= fields_by_name(filter_attributes)
  end

  def filter_attributes
    filters.map { |filter| filter['attribute'] }
  end

  def fields_by_name(field_names)
    Field.find_by_name(field_names).group_by(&:name).transform_values(&:first)
  end

  def build_fields_map(field_names, fields)
    field_names.to_h do |field_name|
      field = fields[field_name] || fields[Field.remove_location_parts(field_name)]
      [field_name, field]
    end
  end

  def select_fields(query)
    query.select(
      Arel.sql(
        "#{ActiveRecord::Base.sanitize_sql(field_queries.map(&:to_sql).join(",\n"))}, count(*) as total"
      )
    )
  end
end
# rubocop:enable Metrics/ClassLength
