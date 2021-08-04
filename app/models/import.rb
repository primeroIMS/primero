# frozen_string_literal: true

# Encapsulate an import of Primero objects
class Import < ValueObject
  SUCCESS = 'success'
  FAILURE = 'failure'
  SOME_FAILURE = 'some_failure'

  attr_accessor :data_base64, :importer, :status, :failures, :error_messages,
                :total, :success_total, :failure_total,
                :content_type, :file_name

  IMPORT_FIELDS_SCHEMA = {
    'file_name' => { 'type' => 'string' },
    'data_base64' => { 'type' => 'string', 'contentEncoding' => 'base64' }
  }.freeze

  def run
    return unless importer && data_base64

    importer_instance = importer.new
    importer_instance.import(data_io)
    assign_status(importer_instance)
  end

  def data_io
    return unless data_base64
    return @data_io if @data_io

    decoded_data = Base64.decode64(data_base64).force_encoding('UTF-8')
    @data_io = StringIO.new(decoded_data)
  end

  def assign_status(importer_instance)
    self.success_total = importer_instance.success_total
    self.failure_total = importer_instance.failures.size
    self.total = importer_instance.total
    self.failures = importer_instance.failures
    self.error_messages = importer_instance.errors

    self.status = if success_total.zero? then FAILURE
                  elsif success_total < total then SOME_FAILURE
                  else SUCCESS
                  end
  end
end
