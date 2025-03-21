# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Create, approve, or deny an approval request
class Api::V2::ApprovalsController < Api::V2::RecordResourceController
  before_action :approval_params, only: [:update]

  def update
    approval = Approval.get!(params[:id], @record, current_user, @approval_params)
    authorize! approval_permission, @model_class
    approval.perform!(@approval_params[:approval_status])
    updates_for_record(@record)
  end

  def update_action_message
    "#{params[:id]}_#{approval_params[:approval_status]}"
  end

  private

  def approval_params
    @approval_params ||= params.require(:data).permit(%i[approval_status approval_type notes])
  end

  def approval_permission
    permission_suffix = if @approval_params[:approval_status] == Approval::APPROVAL_STATUS_REQUESTED
                          'request_approval'
                        else
                          'approve'
                        end
    :"#{permission_suffix}_#{params[:id]}"
  end
end
