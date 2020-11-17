# frozen_string_literal: true

# Encapsulate an export of Primero objects
class Export < ValueObject
  SUCCESS = 'success'
  FAILURE = 'failure'
  SOME_FAILURE = 'some_failure'

  attr_accessor :exporter, :status, :failures, :error_messages,
                :total, :success_total, :failure_total,
                :record_type, :module_id, :file_name, :visible

  def run
    return unless exporter

    exporter_instance = exporter.new(record_type: record_type, module_id: module_id, file_name: file_name,
                                     visible: visible)
    exporter_instance.export
    assign_status(exporter_instance)
  end

  def assign_status(exporter_instance)
    self.file_name = exporter_instance.file_name
    self.error_messages = exporter_instance.errors
    self.success_total = exporter_instance.success_total
    self.total = exporter_instance.total
    self.status = if success_total.zero? then FAILURE
                  elsif success_total < total then SOME_FAILURE
                  else SUCCESS
                  end
  end
end
