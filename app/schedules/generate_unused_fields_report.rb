# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# PeriodicJob to generate the Unused Fields Report
class GenerateUnusedFieldsReport < PeriodicJob
  def self.reschedule_after
    1.day
  end

  def perform_rescheduled
    Rails.logger.info 'Generating the Unused Fields Report...'
    GenerateUnusedFieldsReport.generate!
    Rails.logger.info 'Unused Fields Report generated.'
  end

  def self.generate!
    unused_fields_report = UnusedFieldsReport.new
    unused_fields_report.build
    export_data = Exporters::UnusedFieldsExporter.export(unused_fields_report)
    SystemSettings.current.unused_fields_report_file.attach(
      io: StringIO.new(export_data),
      filename: Exporters::UnusedFieldsExporter.default_file_name
    )
    SystemSettings.current.save!
  end
end
