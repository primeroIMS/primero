# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Service for the logic of bulk assign records
class BulkAssignService
  def initialize(model_class, transitioned_by, args)
    @model_class = model_class
    @transitioned_by = transitioned_by
    @args = args
  end

  def assign_records!
    @model_class.where(id: record_ids).find_in_batches(batch_size: 10) do |records|
      assign_records_batch(records)
    end
  end

  private

  def assign_records_batch(records)
    records.each do |record|
      next unless record.can_be_assigned? && @transitioned_by.can_assign?(record)

      create_assignment(record)
    rescue StandardError => e
      Rails.logger.error e.message
      next
    end
  end

  def create_assignment(record)
    Assign.create!(
      record:,
      transitioned_to: @args[:transitioned_to],
      transitioned_by: @transitioned_by.user_name,
      notes: @args[:notes],
      from_bulk_export: true
    )
  end

  def record_ids
    @args.dig(:filters, :id)
  end
end
