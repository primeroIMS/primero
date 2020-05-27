# frozen_string_literal: true

# Superclass for controllers that modify a dependent resource on a record
# The REST url is something like /api/v2/:records/:record-id/:resources
class Api::V2::RecordResourceController < ApplicationApiController
  before_action :find_record, only: %i[index create update destroy]
  before_action :find_records, only: [:create_bulk]
  before_action :initialize_errors, only: [:create_bulk]

  protected

  def create_bulk
    raise NotImplementedError
  end

  def record_id
    @record_id ||= request.path.split('/')[4]
  end

  def find_record
    @record = model_class.find(record_id)
  end

  def find_records
    @records = if params['data']['ids'].present?
                 model_class.find(params['data']['ids'])
               else
                 []
               end
  end

  def updates_for_record(record)
    @updated_field_names = record_updated_fields(record)
  end

  def updates_for_records(records)
    @updated_field_names_hash = records.each_with_object({}) do |record, hash|
      hash[record.id] = record_updated_fields(record)
    end
  end

  def initialize_errors
    @errors = []
  end

  def handle_bulk_error(error, request)
    _, errors = ErrorService.handle(error, request)
    @errors += errors
  end

  private

  def record_updated_fields(record)
    # We aren't limiting to permitted fields.
    # So far the fields triggered by resource updates haven't been sensistive
    record.saved_changes_to_record.keys
  end
end
