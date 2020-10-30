# frozen_string_literal: true

# Encapsulate an import of Primero objects
class Import < ValueObject
  SUCCESS = 'success'
  FAILURE = 'failure'
  SOME_FAILURE = 'some_failure'

  attr_accessor :data_base64, :importer, :status, :failures,
                :total, :success_total, :failure_total,
                :content_type, :file_name

  def run
    return unless importer && data_base64

    # TODO: This might or might not be the right interface,
    #       but let's pick something then standardize on it for all importers.
    success_total, failures = importer.new.import(data_io)
    assign_status(success_total, failures)
  end

  def data_io
    return unless data_base64
    return @data_io if @data_io

    decoded_data = Base64.decode64(data_base64)
    @data_io = StringIO.new(decoded_data)
  end

  def assign_status(success_total, failures)
    self.success_total = success_total
    self.failure_total = failures.size
    self.total = success_total + failure_total
    self.failures = failures
    self.status = if failure_total.zero? then SUCCESS
                  elsif success_total.zero? then FAILURE
                  else SOME_FAILURE
                  end
  end
end
