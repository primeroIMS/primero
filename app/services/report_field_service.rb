# frozen_string_literal: true

# ReportFieldService
class ReportFieldService
  HORIZONTAL = 'horizontal'
  VERTICAL = 'vertical'

  def self.horizontal_fields(report)
    report.aggregate_by.each_with_index.map do |f, i|
      report_field(report.pivots_map[f], f, HORIZONTAL, i, report.record_type)
    end
  end

  def self.vertical_fields(report)
    report.disaggregate_by.each_with_index.map do |f, i|
      report_field(report.pivots_map[f], f, VERTICAL, i, report.record_type)
    end
  end

  def self.report_field(field, pivot_name, type, order, record_type)
    report_field_hash = {
      name: field&.name,
      display_name: field&.display_name_i18n,
      position: { type: type, order: order }
    }
    report_field_hash.merge(report_field_options(field, pivot_name, record_type) || {})
  end

  def self.report_option_strings_source(field)
    source_options = field.option_strings_source.split.first
    return unless source_options == 'lookup'

    lookup = Lookup.find_by(unique_id: field.option_strings_source.split.last)
    return unless lookup.present?

    all_lookup_values = FieldI18nService.fill_options(lookup.lookup_values_i18n)
    { option_labels: all_lookup_values }
  end

  def self.report_field_options(field, pivot_name, record_type)
    if field&.location? || field&.reporting_location?
      build_reporting_location_field_options(field, pivot_name, record_type)
    elsif field&.agency?
      { option_strings_source: 'Agency' }
    elsif field&.option_strings_text_i18n.present?
      { option_labels: FieldI18nService.fill_options(field.option_strings_text_i18n) }
    elsif field&.option_strings_source.present?
      report_option_strings_source(field)
    end
  end

  def self.report_field_admin_level(field, pivot_name, record_type)
    if field&.location?
      pivot_name.last.to_i
    elsif field&.reporting_location?
      system_settings = SystemSettings.current
      return system_settings.incident_reporting_location_config.admin_level if record_type == Incident.parent_form

      system_settings.reporting_location_config.admin_level
    end
  end

  def self.aggregate_by_from_params(params)
    report_params = params[:fields]&.select { |param| param['position']['type'] == HORIZONTAL }
    report_params&.sort_by { |field| field[:position][:order] }&.map { |field| field['name'] }
  end

  def self.disaggregate_by_from_params(params)
    report_params = params[:fields]&.select { |param| param['position']['type'] == VERTICAL }
    report_params&.sort_by { |field| field[:position][:order] }&.map { |field| field['name'] }
  end

  def self.build_reporting_location_field_options(field, pivot_name, record_type)
    options = { option_strings_source: 'Location' }
    return options unless pivot_name.last.is_number?

    options.merge(admin_level: report_field_admin_level(field, pivot_name, record_type))
  end
end
