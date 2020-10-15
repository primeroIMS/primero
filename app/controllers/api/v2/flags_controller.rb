# frozen_string_literal: true

# API to fetch the list of flags given a user
class Api::V2::FlagsController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  before_action :find_flags, only: %i[index]
  before_action :find_record, only: %i[create update]

  def index
    # TODO: handle pagination
    # TODO: fix front end for old index by record id
    authorize! :index, Flag

    # results = current_user.tasks(pagination)
    # @flags = results[:tasks]
    # @total = results[:total]
  end

  # TODO: fix front end that uses these actions

  def create
    authorize! :flag_record, @record
    @flag = @record.add_flag(flag_params['message'], flag_params['date'], current_user.user_name)
    status = params[:data][:id].present? ? 204 : 200
    updates_for_record(@record)
    render :create, status: status
  end

  def update
    authorize! :flag_record, @record
    @flag = @record.remove_flag(params['id'], current_user.user_name, params['data']['unflag_message'])
    updates_for_record(@record)
  end

  def create_action_message
    'flag'
  end

  def update_action_message
    'unflag'
  end

  protected

  def find_flags
    if params[:record_id].present?
      @flags = Flag.find_by_record_id(params[:record_id], params[:record_type])
    else
      @flags = Flag.by_owner(query_scope, record_types)
    end

    @flags.map {|flag| flag['r_name'] = '*******' if flag['r_name'].present? && flag['r_hidden_name'].present? }
  end

  def find_record
    @record = record_model.find(flag_params[:record_id])
  end

  private

  def record_model
    @record_model ||= Record.model_from_name(flag_params[:record_type])
  end

  def query_scope
    current_user.record_query_scope(model_class, params[:id_search])
  end

  def record_types
    @record_types = params[:record_type]&.split(',')
  end

  def flag_params
    @flag_params ||= params.require(:data).permit(:id, :record_type, :record_id, :date, :message )
  end

  # TODO: Check into this... Stolen from record_resource_controller.rb
  def updates_for_record(record)
    @updated_field_names = record.saved_changes_to_record.keys
  end
end
