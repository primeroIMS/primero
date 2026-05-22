# frozen_string_literal: true

# Endpoint for managing flags for a record
class Api::V2::FlagsController < Api::V2::RecordResourceController
  before_action(except: [:create_bulk]) { authorize! :flag, model_class }
  before_action :bulk_flag_params, only: [:create_bulk]
  before_action :verify_bulk_records_size, only: [:create_bulk]

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
    authorize! :flag_multiple, model_class
    BulkFlagRecordsJob.perform_later(model_class, current_user, bulk_flag_params)
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

  private

  def find_records
    @records = []
    @records_total = BulkFlagService.new(model_class, current_user, bulk_flag_params).search_records.total
  end

  def verify_bulk_records_size
    return if @records_total <= Flag::MAX_BULK_FLAGS

    raise(Errors::BulkFlagRecordsSizeError, 'case.messages.bulk_flag_limit')
  end

  def bulk_flag_params
    @bulk_flag_params ||= params.require(:data)
                                .permit(:message, :date, :query, filters: {})
                                .tap { |data_param| data_param.require(:filters) }
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
