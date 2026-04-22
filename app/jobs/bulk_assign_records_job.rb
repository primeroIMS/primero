# frozen_string_literal: true

# Job that bulk assign records to an user
class BulkAssignRecordsJob < ApplicationJob
  queue_as :long_running_process

  def perform(model_class, transitioned_by, args = {})
    BulkAssignService.new(model_class, transitioned_by, args).assign_records!
  end
end
