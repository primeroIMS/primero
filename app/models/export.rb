# frozen_string_literal: true

# Encapsulate an export of Primero objects
class Export < ValueObject
  SUCCESS = 'success'
  FAILURE = 'failure'
  SOME_FAILURE = 'some_failure'

  attr_accessor :exporter, :status, :failures, :error_messages,
                :total, :success_total, :failure_total,
                :file_name

  def run
    return unless exporter

    # TODO: pass params to exporter.new
    exporter_instance = exporter.new
    exporter_instance.export
    assign_status(exporter_instance)
  end

  def assign_status(exporter_instance)
    # self.success_total = importer_instance.success_total
    # self.failure_total = importer_instance.failures.size
    # self.total = importer_instance.total
    # self.failures = importer_instance.failures
    # self.error_messages = importer_instance.errors
    #
    # self.status = if success_total.zero? then FAILURE
    #               elsif success_total < total then SOME_FAILURE
    #               else SUCCESS
    #
    self.error_messages = exporter_instance.errors
    self.file_name = exporter_instance.file_name
    self.status = SUCCESS
  end
end
