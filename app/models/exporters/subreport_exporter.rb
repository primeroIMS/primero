# frozen_string_literal: true

# Class to export Subreports
# rubocop:disable Metrics/ClassLength
class Exporters::SubreportExporter < ValueObject
  INITIAL_CHART_WIDTH = 384
  INITIAL_CHART_HEIGHT = 460
  EXCEL_COLUMN_WIDTH = 64
  EXCEL_ROW_HEIGHT = 20

  include Exporters::GroupableExporter

  attr_accessor :id, :data, :workbook, :tab_color, :formats, :current_row,
                :worksheet, :managed_report, :locale, :lookups, :grouped_by,
                :years, :groups

  def export
    self.current_row = 0
    self.data = managed_report.data[id][:data]
    self.worksheet = workbook.add_worksheet(build_worksheet_name)
    worksheet.tab_color = tab_color
    load_lookups
    build_groups
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

  def write_table_header(indicator_key)
    write_grey_row

    worksheet.set_row(current_row, 30)
    worksheet.merge_range(
      current_row, 0, current_row, 1,
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator_key}", locale: locale),
      formats[:blue_header]
    )
    self.current_row += 1

    write_total_row
  end

  def write_total_row
    worksheet.set_row(current_row, 40)
    worksheet.write(current_row, 1, I18n.t('managed_reports.total', locale: locale), formats[:bold_blue])
    self.current_row += 1
  end

  def write_graph(table_data_rows)
    return unless table_data_rows.present?

    chart = workbook.add_chart(type: 'column', embedded: 1, name: '')
    chart.add_series(build_series(table_data_rows))
    chart.set_size(height: INITIAL_CHART_HEIGHT, width: chart_width(table_data_rows))
    chart.set_legend(none: true)
    chart.set_y_axis(major_unit: 1)
    worksheet.insert_chart(current_row, 0, chart, 0, 0)

    self.current_row += (INITIAL_CHART_HEIGHT / EXCEL_ROW_HEIGHT)
  end

  def build_series(table_data_rows)
    {
      categories: [worksheet.name] + table_data_rows + [0, 0],
      values: [worksheet.name] + table_data_rows + [1, 1],
      points: Exporters::ManagedReportExporter::CHART_COLORS.values.map { |color| { fill: { color: color } } }
    }
  end

  def chart_width(table_data_rows)
    row_count = table_data_rows.last - table_data_rows.first
    return INITIAL_CHART_WIDTH if row_count < 3

    INITIAL_CHART_WIDTH + (row_count * EXCEL_COLUMN_WIDTH)
  end

  def transform_entries
    data[:order].map do |key|
      [key, transform_indicator_values(data[key])]
    end
  end

  def write_indicators
    transform_entries.each do |(indicator_key, indicator_values)|
      next unless indicator_values.is_a?(Array)

      if grouped_by.present?
        write_grouped_indicator(indicator_key, indicator_values)
      else
        write_indicator(indicator_key, indicator_values)
      end
    end
  end

  def write_indicator(indicator_key, indicator_values)
    indicator_lookups = lookups[indicator_key]
    write_table_header(indicator_key)
    start_row = current_row
    write_indicator_data(indicator_values, indicator_lookups)
    last_row = current_row - 1
    write_graph([start_row, last_row])
    self.current_row += 1
  end

  def write_indicator_data(values, indicator_lookups)
    values.each do |elem|
      if elem == values.last
        write_indicator_last_row(elem, indicator_lookups)
      else
        write_indicator_row(elem, indicator_lookups)
      end
      self.current_row += 1
    end
  end

  def write_indicator_row(elem, indicator_lookups)
    display_text = value_display_text(elem, indicator_lookups)
    worksheet.write(current_row, 0, display_text, formats[:bold_black])
    worksheet.write(current_row, 1, elem['total'])
  end

  def write_indicator_last_row(elem, indicator_lookups)
    display_text = value_display_text(elem, indicator_lookups)
    worksheet.write(current_row, 0, display_text, formats[:bold_black_blue_bottom_border])
    worksheet.write(current_row, 1, elem['total'], formats[:blue_bottom_border])
  end

  def value_display_text(elem, indicator_lookups)
    if indicator_lookups.blank?
      return I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{elem['id']}", default: elem['id'])
    end

    display_text_from_lookup(elem, indicator_lookups) || elem['id']
  end

  def display_text_from_lookup(elem, indicator_lookups)
    if indicator_lookups.is_a?(LocationService)
      return indicator_lookups.find_by_code(elem['id'])&.name_i18n&.dig(I18n.locale.to_s)
    end

    indicator_lookups.find { |lookup_value| lookup_value['id'] == elem['id'] }&.dig('display_text')
  end

  def transform_indicator_values(values)
    return values.map(&:with_indifferent_access) if values.is_a?(Array)
    return values unless values.is_a?(Hash)

    values.reduce([]) do |acc, (key, value)|
      acc << { id: key, total: value }.with_indifferent_access
    end
  end

  def load_lookups
    subreport_lookups = managed_report.data.with_indifferent_access.dig(id, 'metadata', 'lookups')

    self.lookups = (subreport_lookups || []).reduce({}) do |acc, (key, value)|
      next acc.merge(key => LocationService.instance) if key == 'reporting_location'

      acc.merge(key => Lookup.values(value, nil, { locale: locale }))
    end
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
end
# rubocop:enable Metrics/ClassLength
