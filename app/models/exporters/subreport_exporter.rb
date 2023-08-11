# frozen_string_literal: true

# Class to export Subreports
# rubocop:disable Metrics/ClassLength
class Exporters::SubreportExporter < ValueObject
  include Exporters::Concerns::InsightParams

  attr_accessor :id, :data, :workbook, :tab_color, :formats, :current_row,
                :worksheet, :managed_report, :locale, :lookups, :grouped_by,
                :indicators_subcolumns, :subcolumn_lookups

  def export
    self.current_row = 0
    self.data = managed_report.data[id][:data]
    setup_worksheet
    load_indicators_subcolumns
    load_lookups
    write_export
  end

  def setup_worksheet
    self.worksheet = workbook.add_worksheet(build_worksheet_name)
    worksheet.tab_color = tab_color
  end

  def build_worksheet_name
    # Truncating in 31 allowed characters
    # Replacing invalid character
    I18n.t("managed_reports.#{managed_report.id}.reports.#{id}", locale:)
        .truncate(31)
        .gsub(%r{[\[\]/:*?]}, ' ')
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
      I18n.t("managed_reports.#{managed_report.id}.reports.#{id}", locale:),
      formats[:header]
    )
  end

  def write_params
    worksheet.set_row(current_row, 20)
    # TODO: Will this be problematic for arabic languages?
    params = params_list
    return unless params.present?

    params += [formats[:black]]
    worksheet.write_rich_string(current_row, 0, *params)
    self.current_row += 1
  end

  def write_generated_on
    worksheet.merge_range_type(
      'rich_string',
      current_row, 0, current_row, 1,
      formats[:bold_blue], "#{I18n.t('managed_reports.generated_on', locale:)}: ",
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

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def build_indicator_exporter(indicator_key, indicator_values)
    indicator_exporter_class.new(
      key: indicator_key,
      values: indicator_values,
      worksheet:,
      lookups: lookups[indicator_key],
      current_row:,
      grouped_by:,
      formats:,
      managed_report:,
      locale:,
      workbook:,
      subcolumn_lookups: subcolumn_lookups[indicator_key],
      indicator_rows: metadata_property('indicators_rows')&.dig(indicator_key),
      indicator_subcolumns: indicators_subcolumns[indicator_key]
    )
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

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
    Lookup.values(value, nil, { locale: })
  end

  def load_lookups
    self.lookups = load_lookup_config(metadata_property('lookups') || {})
    self.subcolumn_lookups = load_lookup_config(indicator_subcolumn_lookups)
  end

  def load_lookup_config(lookup_config)
    lookup_config.reduce({}) do |acc, (key, value)|
      next acc.merge(key => user_group_as_lookup_values) if %w[UserGroupPermitted].include?(value)

      if %w[reporting_location reporting_location_detention reporting_location_denial].include?(key)
        next acc.merge(key => LocationService.instance)
      end

      lookup_obj = value.is_a?(Array) ? value.to_h { |l| [l, find_lookup(l)] } : find_lookup(value)

      acc.merge(key => lookup_obj)
    end
  end

  def user_group_as_lookup_values
    UserGroup.all.map { |user_group| { 'id' => user_group.unique_id, 'display_text' => user_group.name } }
  end

  def load_indicators_subcolumns
    self.indicators_subcolumns = metadata_property('indicators_subcolumns')
  end

  def indicator_subcolumn_lookups
    (indicators_subcolumns || {}).select { |_key, value| value.is_a?(String) }
  end

  def metadata_property(property)
    managed_report.data.with_indifferent_access.dig(id, 'metadata', property)
  end
end
# rubocop:enable Metrics/ClassLength
