# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# API to fetch the unused fields report
class Api::V2::UnusedFieldsReportController < ApplicationApiController
  def current
    authorize_unused_fields_report!
    @unused_fields_report_file = SystemSettings.current.unused_fields_report_file
    raise ActiveRecord::RecordNotFound unless @unused_fields_report_file.attached?
  end

  def authorize_unused_fields_report!
    authorized = current_user.can?(:manage, FormSection) || current_user.can?(:manage, Lookup)
    raise Errors::ForbiddenOperation unless authorized
  end

  def model_class
    UnusedFieldsReport
  end
end
