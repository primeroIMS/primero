# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API endpoints that handle record reassignment
class Api::V2::AssignsController < Api::V2::RecordResourceController
  before_action :bulk_approval_params, only: [:create_bulk]
  before_action :verify_bulk_records_size, only: [:create_bulk]

  def index
    authorize! :read, @record
    @transitions = @record.assigns
    render 'api/v2/transitions/index'
  end

  def create
    authorize_assign!(@record)
    @transition = assign(@record)
    updates_for_record(@record)
    render 'api/v2/transitions/create'
  end

  def create_bulk
    authorize_assign!(model_class)
    BulkAssignRecordsJob.perform_later(model_class, current_user, bulk_approval_params)
  end

  private

  def authorize_assign!(record)
    can_assign =
      current_user.can?(Permission::ASSIGN.to_sym, record) ||
      current_user.can?(Permission::ASSIGN_WITHIN_AGENCY.to_sym, record) ||
      current_user.can?(Permission::ASSIGN_WITHIN_USER_GROUP.to_sym, record)
    raise Errors::ForbiddenOperation unless can_assign
  end

  def authorize_assign_all!(records)
    records.each { |r| authorize_assign!(r) }
  end

  def assign(record)
    transitioned_to = params[:data][:transitioned_to]
    notes = params[:data][:notes]
    transitioned_by = current_user.user_name
    Assign.create!(
      record:, transitioned_to:,
      transitioned_by:, notes:
    )
  end

  def create_action_message
    'assign'
  end

  def destroy_action_message
    'unassign'
  end

  def create_bulk_record_resource
    'bulk_assign'
  end

  def bulk_approval_params
    @bulk_approval_params ||= params.require(:data).permit(:transitioned_to, :notes, :query, { filters: {} }).to_h
  end

  def find_records
    @records = []
  end

  def verify_bulk_records_size
    if @bulk_approval_params[:filters][:short_id].blank? ||
       @bulk_approval_params[:filters][:short_id].length <= Assign::MAX_BULK_RECORDS
      return
    end

    raise(Errors::BulkAssignRecordsSizeError, 'case.messages.bulk_assign_limit')
  end
end
