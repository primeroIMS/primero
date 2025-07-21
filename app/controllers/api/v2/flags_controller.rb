# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Endpoint for managing flags for a record
class Api::V2::FlagsController < Api::V2::RecordResourceController
  before_action { authorize! :flag, model_class }

  def create
    authorize! :flag_record, @record
    @flag = @record.add_flag!(permitted_create_params[:message], permitted_create_params[:date], current_user.user_name)
    updates_for_record(@record)
    render :create, status:
  end

  def update
    authorize!(flag_action.to_sym, @record)
    @flag = @record.update_flag!(params['id'], current_user.user_name, permitted_update_params)
    updates_for_record(@record)
  end

  def create_bulk
    authorize_all!(:flag, @records)
    model_class.batch_flag(@records, params['data']['message'], params['data']['date'].to_date, current_user.user_name)
  end

  def create_action_message
    'flag'
  end

  def update_action_message
    'unflag'
  end

  def create_bulk_record_resource
    'bulk_flag'
  end

  def status
    params[:data][:id].present? ? 204 : 200
  end

  def permitted_create_params
    @permitted_create_params ||= params.require(:data).permit(:message, :date)
  end

  def permitted_update_params
    @permitted_update_params ||= params.require(:data).permit(:message, :date, :unflag_message)
  end

  def flag_action
    return 'flag_update' unless permitted_update_params[:unflag_message].present?

    'flag_resolve'
  end
end
