# frozen_string_literal: true

# Class to export Subreports
# rubocop:disable Metrics/ClassLength
class Exporters::SubreportExporter < ValueObject
  INITIAL_CHART_WIDTH = 384
  INITIAL_CHART_HEIGHT = 460
  EXCEL_COLUMN_WIDTH = 64
  EXCEL_ROW_HEIGHT = 20

  attr_accessor :id, :data, :workbook, :tab_color, :formats, :current_row,
                :worksheet, :managed_report, :locale, :lookups, :grouped_by,
                :indicators_subcolumns, :subcolumn_lookups

  def export
    self.current_row = 0
    self.data = managed_report.data[id][:data]
    self.worksheet = workbook.add_worksheet(build_worksheet_name)
    worksheet.tab_color = tab_color
    load_indicators_subcolumns
    load_lookups
    write_export
  end

  def build_worksheet_name
    # Truncating in 31 allowed characters
    # Replacing invalid character
    I18n.t("managed_reports.#{managed_report.id}.reports.#{id}", locale: locale)
        .truncate(31)
        .gsub(%r{[\[\]\/:*?]}, ' ')
  end

  def write_export
    write_header
    write_params
    write_generated_on
    write_indicators
  end

  def write_header
    worksheet.set_column(current_row, 0, 80)
    worksheet.set_row(current_row, 40)
    write_header_title
    self.current_row += 1
  end

  def write_header_title
    worksheet.merge_range(
      current_row, 0, 0, 1,
      I18n.t("managed_reports.#{managed_report.id}.reports.#{id}", locale: locale),
      formats[:header]
    )
  end

  def write_params
    worksheet.set_row(current_row, 20)
    # TODO: Will this be problematic for arabic languages?
    params = params_list
    return unless params.present?

    params += [formats[:black]]
    worksheet.merge_range_type('rich_string', current_row, 0, current_row, 3, *params)
    self.current_row += 1
  end

  def params_list
    view_by_param + date_range_param + date_range_values_param + filter_by_date_param + verification_status_param
  end

  def view_by_param
    return [] unless grouped_by_param.present?

    [
      formats[:bold_blue], "#{I18n.t('fields.date_range.view_by', locale: locale)}: ",
      formats[:black], "#{I18n.t("managed_reports.date_range.#{grouped_by_param.value}", locale: locale)} / "
    ]
  end

  def date_range_param
    return [] unless date_range_display_text.present?

    [
      formats[:bold_blue], "#{I18n.t('fields.date_range_field', locale: locale)}: ",
      formats[:black], "#{date_range_display_text} / "
    ]
  end

  def date_range_values_param
    return [] unless managed_report.date_range_value.blank?

    custom_date_value(:from) + custom_date_value(:to)
  end

  def custom_date_value(date_value)
    value = managed_report.date_range_filter&.send(date_value)
    return [] if value.blank?

    [
      formats[:bold_blue], "#{I18n.t("fields.date_range.#{date_value}", locale: locale)}: ",
      formats[:black], "#{value} / "
    ]
  end

  def filter_by_date_param
    return [] unless date_display_text.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.date', locale: locale)}: ",
      formats[:black], "#{date_display_text} / "
    ]
  end

  def verification_status_param
    return [] unless verification_display_text.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.verification_status', locale: locale)}: ",
      formats[:black], verification_display_text
    ]
  end

  def grouped_by_param
    self.grouped_by = managed_report.filters.find { |filter| filter.field_name == 'grouped_by' }

    grouped_by
  end

  def write_generated_on
    worksheet.merge_range_type(
      'rich_string',
      current_row, 0, current_row, 1,
      formats[:bold_blue], "#{I18n.t('managed_reports.generated_on', locale: locale)}: ",
      formats[:black], Time.now.strftime('%Y-%m-%d %H:%M:%S'),
      formats[:black]
    )
    self.current_row += 1
  end

  def transform_entries
    metadata_property('order').map do |key|
      [key, transform_indicator_values(data[key])]
    end
  end

  def write_indicators
    transform_entries.each do |(indicator_key, indicator_values)|
      next unless indicator_values.is_a?(Array)

      indicator_exporter = build_indicator_exporter(indicator_key, indicator_values)
      indicator_exporter.write
      self.current_row = indicator_exporter.current_row
    end
  end

  def build_indicator_exporter(indicator_key, indicator_values)
    indicator_exporter_class.new(
      key: indicator_key,
      values: indicator_values,
      worksheet: worksheet,
      lookups: lookups[indicator_key],
      current_row: current_row,
      grouped_by: grouped_by,
      formats: formats,
      managed_report: managed_report,
      locale: locale,
      workbook: workbook,
      subcolumn_lookups: subcolumn_lookups[indicator_key],
      indicator_subcolumns: indicators_subcolumns[indicator_key]
    )
  end

  def indicator_exporter_class
    grouped_by.present? ? Exporters::GroupedIndicatorExporter : Exporters::IndicatorExporter
  end

  def transform_indicator_values(values)
    return values.map(&:with_indifferent_access) if values.is_a?(Array)
    return values unless values.is_a?(Hash)

    values.reduce([]) do |acc, (key, value)|
      acc << { id: key, total: value }.with_indifferent_access
    end
  end

  def find_lookup(value)
    Lookup.values(value, nil, { locale: locale })
  end

  def load_lookups
    self.lookups = load_lookup_config(metadata_property('lookups') || {})
    self.subcolumn_lookups = load_lookup_config(indicator_subcolumn_lookups)
  end

  def load_lookup_config(lookup_config)
    lookup_config.reduce({}) do |acc, (key, value)|
      if %w[reporting_location reporting_location_detention reporting_location_denial].include?(key)
        next acc.merge(key => LocationService.instance)
      end

      lookup_obj = value.is_a?(Array) ? value.map { |l| [l, find_lookup(l)] }.to_h : find_lookup(value)

      acc.merge(key => lookup_obj)
    end
  end

  def load_indicators_subcolumns
    self.indicators_subcolumns = metadata_property('indicators_subcolumns')
  end

  def indicator_subcolumn_lookups
    (indicators_subcolumns || {}).select { |_key, value| value.is_a?(String) && value.starts_with?('lookup') }
  end

  def date_display_text
    date_field_name = managed_report.date_field_name

    return unless date_field_name.present?

    I18n.t("managed_reports.#{managed_report.id}.filter_options.#{date_field_name}", locale: locale)
  end

  def date_range_display_text
    date_range_value = managed_report.date_range_value

    return I18n.t('managed_reports.date_range_options.custom', locale: locale) unless date_range_value.present?

    I18n.t("managed_reports.date_range_options.#{date_range_value}", locale: locale)
  end

  def verification_display_text
    verified_value = managed_report.verified_value

    return unless verified_value.present? && verified_value == 'verified'

    I18n.t('managed_reports.violations.filter_options.verified', locale: locale)
  end

  def metadata_property(property)
    managed_report.data.with_indifferent_access.dig(id, 'metadata', property)
  end
end
# rubocop:enable Metrics/ClassLength
