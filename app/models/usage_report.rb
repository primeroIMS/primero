# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# class for Usage Report
class UsageReport < BulkExport
  def self.export(kpi_parameters)
    exporter.export(kpi_parameters['start_date'], kpi_parameters['end_date'], kpi_parameters['request'])
    exporter.complete
    mark_completed!
  end

  def exporter
    return @exporter if @exporter.present?

    @exporter = Exporters::UsageReportExporter.new(
      stored_file_name,
      { record_type:, user: owner },
      custom_export_params&.with_indifferent_access || {}
    )
  end

  def stored_file_name
    return unless file_name.present?

    File.join(Rails.configuration.exports_directory, "#{id}_#{file_name}")
  end
end
