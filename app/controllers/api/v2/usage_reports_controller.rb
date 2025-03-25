# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API endpoint for generating usage reports
class Api::V2::UsageReportsController < ApplicationApiController
  include Api::V2::Concerns::Export

  def show
    authorize! :show, UsageReport
    @usage_report = report
  end

  protected

  def usage_report_params
    return @usage_report_params if @usage_report_params.present?

    @usage_report_params = params.permit(:from, :to, :file_name, :export_type)
    @usage_report_params = DestringifyService.destringify(@usage_report_params.to_h, true)
  end

  def exporter
    Exporters::UsageReportExporter
  end

  def report
    @report ||= UsageReport.new(usage_report_params.slice(:from, :to)).tap(&:build)
  end

  def module_id
    nil
  end

  def record_type
    UsageReport
  end

  def model_class
    UsageReport
  end
end
