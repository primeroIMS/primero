# frozen_string_literal: true

# Job that bulk flags records
class BulkFlagRecordsJob < ApplicationJob
  queue_as :long_running_process

  def perform(model_class, flagged_by, args = {})
    BulkFlagService.new(model_class, flagged_by, args).flag_records!
  end
end
