# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Non bulk export of Primero objects
class Export < ValueObject
  SUCCESS = 'success'
  FAILURE = 'failure'
  SOME_FAILURE = 'some_failure'

  attr_accessor :exporter, :status, :failures, :error_messages,
                :total, :success_total, :failure_total,
                :record_type, :module_id, :visible, :file_name, :export_file_blob,
                :managed_report, :hostname, :opts

  def run
    return no_exporter_error unless exporter

    exporter_instance = exporter.new(record_type:, module_id:, file_name:,
                                     visible:, managed_report:, hostname:, opts:)
    exporter_instance.export
    attach_export_file(exporter_instance.file_name)
    assign_status(exporter_instance)
  end

  def no_exporter_error
    self.error_messages = [I18n.t('exports.messages.no_exporter')]
    self.status = FAILURE
  end

  def attach_export_file(file)
    return unless file && File.size?(file)

    self.export_file_blob = ActiveStorage::Blob.create_and_upload!(
      io: File.open(file),
      filename: File.basename(file)
    )
    File.delete(file)
  end

  def assign_status(exporter_instance)
    self.file_name = File.basename(exporter_instance.file_name)
    self.error_messages = exporter_instance.errors
    self.status = export_status(exporter_instance)
  end

  def export_status(exporter_instance)
    return error_messages.blank? ? SUCCESS : FAILURE unless exporter_instance.respond_to?(:total)

    self.success_total = exporter_instance.success_total
    self.total = exporter_instance.total
    if success_total.zero? then FAILURE
    elsif success_total < total then SOME_FAILURE
    else
      SUCCESS
    end
  end
end
