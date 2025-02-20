# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Executes a UsageReportJob
class UsageReportJob < ApplicationJob
  queue_as :usage_report_export

  def perform(bulk_export_id, encrypted_password, kpi_parameters)
    bulk_export = BulkExport.find_by(id: bulk_export_id)
    password = EncryptionService.decrypt(encrypted_password)
    return log_bulk_export_missing(bulk_export_id) unless bulk_export.present?

    bulk_export.usage_export(password, kpi_parameters)
  rescue Errors::MisconfiguredEncryptionError => e
    log_encryption_error(bulk_export_id, e)
  end

  def log_bulk_export_missing(id)
    Rails.logger.warn("BulkExport Id: #{id} was not found. Skipping...")
  end

  def log_encryption_error(id, error)
    Rails.logger.error(
      "BulkExport Id: #{id} could not be enqueued because the password could not be decrypted!" \
      "\n#{error.backtrace}"
    )
  end
end
