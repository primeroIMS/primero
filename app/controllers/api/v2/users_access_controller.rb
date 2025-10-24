# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# API to list users that accessed to a record
class Api::V2::UsersAccessController < Api::V2::RecordResourceController
  include Api::V2::Concerns::SupplementData

  before_action :find_record, only: %i[access]

  def access
    authorize_access!(:access_log)

    @users = User.who_accessed_record(@record)
    render 'api/v2/users/users_accessed_record'
  end

  private

  def user_access_params
    params.permit(:record_type, :record_id)
  end

  protected

  def record_id
    @record_id ||= user_access_params[:record_id]
  end

  def model_class
    @model_class ||= PrimeroModelService.to_model(user_access_params[:record_type])
  end
end
