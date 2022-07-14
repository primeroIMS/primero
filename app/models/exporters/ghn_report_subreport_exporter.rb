# frozen_string_literal: true

# Class to export Ghn Subreports
class Exporters::GhnReportSubreportExporter < Exporters::SubreportExporter
  def translate_group(group)
    group_locale = locale.blank? || I18n.available_locales.exclude?(locale.to_sym) ? I18n.default_locale.to_s : locale

    I18n.t("managed_reports.#{id}.sub_reports.#{group}", locale: group_locale)
  end

  def write_subcolumns_data(grouped_data, options, initial_index, year, indicator_key)
    sort_group(year).each_with_index do |group, group_index|
      group_data = grouped_data[group].first['data']
      write_columns_data(group_data, options, initial_index, group_index, indicator_key)
    end
  end

  def header_include_year?
    false
  end

  def write_indicators
    transform_entries.each do |(indicator_key, indicator_values)|
      next unless indicator_values.is_a?(Array)

      if indicator_values.any? { |g| g[:group_id].present? }
        write_grouped_indicator(indicator_key, indicator_values)
      elsif violations_indicator?(indicator_key)
        write_violations_indicator(indicator_key, indicator_values)
      else
        write_indicator(indicator_key, indicator_values)
      end
    end
  end

  def write_child_information(indicator_key, elem)
    child_information = [
      elem[:data][:unique_id].last(7),
      display_text_from_lookup(elem[:data][:individual_sex], lookups[indicator_key]['lookup-gender-unknown-total']),
      elem[:data][:individual_age]
    ].compact.join(' - ')
    worksheet.write(current_row, 0, child_information)
  end

  def write_violations(elem)
    violations = elem[:data][:violations].map do |v|
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{v}", locale: locale)
    end.join("\n")
    worksheet.write(current_row, 1, violations)
  end

  def write_violations_data(indicator_key, values)
    values.each do |elem|
      write_child_information(indicator_key, elem)
      write_violations(elem)

      self.current_row += 1
    end
  end

  def write_violations_indicator(indicator_key, indicator_values)
    write_table_header(indicator_key, 'managed_reports.ghn_report.sub_reports.associated_violations')
    write_violations_data(indicator_key, indicator_values)
    self.current_row += 1
  end

  def violations_indicator?(indicator_key)
    indicator_key == ManagedReports::Indicators::MultipleViolations.id
  end

  def params_list
    view_by_param + date_range_param + date_range_values_param
  end
end
