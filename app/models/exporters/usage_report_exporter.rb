# frozen_string_literal: true

# Copyright (c) 2014 UNICEF. All rights reserved.

# Class to export UsageReport
class Exporters::UsageReportExporter < ValueObject
  attr_accessor :file_name, :usage_report, :hostname, :locale, :workbook, :completed, :errors # TODO: do I need :errors?

  def initialize(args = {})
    super(args)
    # managed_report is used by the ::Export model
    # TODO: Refactor ::Export and ManagedReportExporter to rename managed_report to be something generic
    self.usage_report ||= args[:managed_report] if args[:managed_report].present?
    self.locale ||= I18n.locale
    self.file_name = export_file_name(file_name)
    self.workbook = WriteXLSX.new(file_name)
  end

  def export
    return unless usage_report.present? && usage_report.data.present?

    build_user_sheet
    usage_report.data[:modules].each do |mod|
      build_module_sheet(mod)
    end
    complete
  end

  def complete
    self.completed = true
    workbook.close
  end

  private

  def build_user_sheet
    worksheet = workbook.add_worksheet(t('users'))
    adjust_column_width(worksheet)
    summary_header(worksheet)
    summary_modules(worksheet)
    users_by_agency(worksheet)
  end

  def summary_header(worksheet)
    [
      ['hostname', hostname],
      ['start_date', usage_report.from],
      ['end_date', usage_report.to],
      ['quarter', "Q#{usage_report.quarter}"],
      ['agencies_total', usage_report.data[:agencies_total]]
    ].each_with_index do |line, i|
      worksheet.write(i, 0, [t(line[0]), line[1]])
    end
  end

  def summary_modules(worksheet)
    usage_report.data[:modules].each.with_index(6) do |mod, i|
      present = if mod[:unique_id] == PrimeroModule::MRM
                  mod[:incidents_total].positive?
                else
                  mod[:cases_total].positive?
                end
      worksheet.write(i, 0, [mod[:name], present ? t('module_yes') : t('module_no')])
    end
  end

  def users_by_agency(worksheet)
    worksheet.write(10, 0, %w[agency_list users_total users_active users_disabled users_new].map { |s| t(s) })
    usage_report.data[:agencies].each.with_index(11) do |agency, i|
      worksheet.write(i, 0, agency.fetch_values(:unique_id, :users_total, :users_active, :users_disabled, :users_new))
    end
  end

  def build_module_sheet(mod)
    worksheet = workbook.add_worksheet(mod[:name])
    adjust_column_width(worksheet)
    worksheet.write(0, 0, module_header(mod))
    worksheet.write(1, 0, module_content(mod))
  end

  def module_header(mod)
    if mod[:unique_id] == PrimeroModule::MRM
      [mod[:name]] + %w[incidents_total incidents_open_this_quarter].map { |s| t(s) }
    else
      [mod[:name]] + %w[cases_total cases_open cases_closed cases_open_this_quarter cases_closed_this_quarter
                        services_total followups_total incidents_total incidents_open_this_quarter].map { |s| t(s) }
    end
  end

  def module_content(mod)
    if mod[:unique_id] == PrimeroModule::MRM
      ['', mod[:incidents_total], mod[:incidents_open_this_quarter]]
    else
      ['', mod[:cases_total], mod[:cases_open], mod[:cases_closed], mod[:cases_open_this_quarter],
       mod[:cases_closed_this_quarter], mod[:services_total], mod[:followups_total], mod[:incidents_total],
       mod[:incidents_open_this_quarter]]
    end
  end

  def adjust_column_width(worksheet)
    ('A'..'L').each_with_index do |_, col_index|
      worksheet.set_column(col_index, col_index, 20) # Adjust column width
    end
  end

  def default_file_name
    "usage_report_#{Date.today.strftime('%Y%m%d')}.xlsx"
  end

  def export_file_name(file_name)
    if file_name.present?
      file_name += '.xlsx' unless file_name.ends_with?('.xlsx')
    else
      file_name = default_file_name
    end
    File.join(Rails.root, 'tmp', File.basename(file_name))
  end

  def t(string)
    I18n.t("usage_report.export.#{string}", locale:)
  end
end
