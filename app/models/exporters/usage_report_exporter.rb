# frozen_string_literal: true

# Export forms to an Excel file (.xlsx)
# rubocop:disable Metrics/ClassLength
class Exporters::UsageReportExporter < Exporters::ExcelExporter
  attr_accessor :file_name, :workbook, :errors, :worksheets

  class << self
    def id
      'xlsx'
    end

    def supported_models
      [User]
    end
  end

  def initialize(output_file_path = nil, config = {}, options = {})
    super(output_file_path, config, options)
    self.workbook = WriteXLSX.new(buffer)
    self.worksheets = {}
    self.locale = user&.locale || I18n.locale
  end

  def export(start_date, end_date, request)
    export_user_row(start_date, end_date, request)
    modules = UsageReport.modules
    modules.each { |modul| export_modules(modul, start_date, end_date) }
  end

  def complete
    @workbook.close
    buffer
  end

  private

  def export_modules(modul, start_date, end_date)
    return if modul.blank? || modul.instance_of?(ActiveRecord::Relation)

    export_module_to_workbook(modul, start_date, end_date)
  end

  def export_module_to_workbook(modul, start_date, end_date)
    worksheet = workbook.add_worksheet(modul.name)
    adjust_column_width(worksheet)
    worksheet.write(0, 0, module_header(modul.name))
    worksheet.write(1, 0, module_content(modul.unique_id, start_date, end_date, modul.name))
  end

  def module_header(modul_name)
    common_keys = [modul_name, 'Total Cases', 'Open Cases', 'Closed Cases', 'Open this quarter',
                   'Closed this Quarter', 'Total Services', 'Total incidents', 'Incidents this quarter']
    case modul_name
    when 'MRM'
      [modul_name, 'Total incidents', 'Incidents this quarter']
    when 'GBV'
      common_keys
    else
      common_keys + ['Total followups']
    end
  end

  def get_common_keys(module_id, start_date, end_date)
    ['', UsageReport.get_total_records(module_id, Child), UsageReport.get_open_cases(module_id),
     UsageReport.get_closed_cases(module_id),
     UsageReport.get_new_records_quarter(module_id, start_date, end_date, Child),
     UsageReport.get_closed_cases_quarter(module_id, start_date, end_date),
     UsageReport.get_total_services(module_id), UsageReport.get_total_records(module_id, Incident),
     UsageReport.get_new_records_quarter(module_id, start_date, end_date, Incident)]
  end

  def module_content(module_id, start_date, end_date, modul_name)
    common_keys = get_common_keys(module_id, start_date, end_date)
    case modul_name
    when 'MRM'
      ['', UsageReport.get_total_records(module_id, Incident),
       UsageReport.get_new_records_quarter(module_id, start_date, end_date, Incident)]
    when 'GBV'
      common_keys
    else
      common_keys + [UsageReport.get_total_followup(module_id)]
    end
  end

  def kpi_user_header(start_date, end_date, request, worksheet)
    worksheet.write(0, 0, user_url_header(request))
    worksheet.write(1, 0, user_start_date_header(start_date))
    worksheet.write(2, 0, user_end_date_header(end_date))
    worksheet.write(3, 0, quarter_for_date(end_date))
    worksheet.write(4, 0, total_agencies)
  end

  def export_user_row(start_date, end_date, request)
    worksheet = workbook.add_worksheet('Users')
    adjust_column_width(worksheet)
    kpi_user_header(start_date, end_date, request, worksheet)
    row_indx = 6
    UsageReport.modules.each do |modul|
      worksheet.write(row_indx, 0, module_tabs(modul.unique_id, modul.name))
      row_indx += 1
    end
    worksheet.write(10, 0, user_header)
    worksheet.write(11, 0, user_content(start_date, end_date))
  end

  def quarter_for_date(end_date)
    ['Quarter', determine_quarter(end_date)]
  end

  def determine_quarter(end_date)
    case end_date.month
    when 1..3
      'Q1'
    when 4..6
      'Q2'
    when 7..9
      'Q3'
    else
      'Q4'
    end
  end

  def user_url_header(request)
    ['Url', request]
  end

  def user_start_date_header(start_date)
    ['Start Date', start_date]
  end

  def user_end_date_header(end_date)
    ['End Date', end_date]
  end

  def total_agencies
    ['Total No. of Agencies', UsageReport.all_agencies.count]
  end

  def module_tabs(module_id, modul_name)
    if modul_name == 'MRM'
      [modul_name, UsageReport.get_total_records(module_id, Incident).positive? ? ' Yes' : ' No']
    else
      [modul_name, UsageReport.get_total_records(module_id, Child).positive? ? ' Yes' : ' No']
    end
  end

  def user_header
    ['Agency List', 'Total Users', 'Active Users', 'Disabled Users', 'New Users in this quarter']
  end

  def user_content(start_date, end_date)
    data = UsageReport.all_agencies.map do |agency|
      [agency.unique_id,
       UsageReport.get_all_users(agency),
       UsageReport.get_active_users(agency),
       UsageReport.get_disabled_users(agency),
       UsageReport.get_new_quarter_users(agency, start_date, end_date)]
    end
    data.transpose
  end

  def adjust_column_width(worksheet)
    ('A'..'L').each_with_index do |_, col_index|
      worksheet.set_column(col_index, col_index, 20) # Adjust column width
    end
  end
end
# rubocop:enable Metrics/ClassLength
