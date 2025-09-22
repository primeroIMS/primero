# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Shared code for all record-type controllers.
# This will be a long module, by it's nature,
# but we'll need to be careful to extract as much code as possible into services
# rubocop:disable Metrics/ModuleLength
module Api::V2::Concerns::Record
  extend ActiveSupport::Concern

  included do
    before_action :display_permitted_forms
    before_action :instantiate_app_services
    before_action :permit_readable_fields, only: [:index]
    before_action :select_fields_for_index, only: [:index]
  end

  def index
    authorize! :index, model_class
    result = search_records
    @total = result[:total]
    @records = result[:records]
    render 'api/v2/records/index'
  end

  def show
    authorize! :read, model_class
    @record = find_record
    authorize! :read, @record
    permit_readable_fields
    select_fields_for_show
    render 'api/v2/records/show'
  end

  def create
    authorize_create! && validate_json!
    @record = model_class.new_with_user(current_user, record_params)
    @record.save!
    permit_readable_fields
    select_updated_fields
    status = params[:data][:id].present? ? 204 : 200
    render 'api/v2/records/create', status:
  end

  def update
    @record = find_record
    authorize_update! && validate_json!
    @record.update_properties(current_user, record_params)
    @record.save!
    permit_readable_fields
    select_updated_fields
    render 'api/v2/records/update'
  end

  def destroy
    authorize! :enable_disable_record, model_class
    @record = find_record
    @record.update_properties(current_user, record_state: false)
    @record.save!
    render 'api/v2/records/destroy'
  end

  def index_params
    return @index_params if @index_params

    @index_params = params.permit(
      :fields, :order, :order_by, :page, :per, :total,
      :id_search, :query, :query_scope, :phonetic, :format,
      *permitted_index_params(params)
    )
  end

  def json_validation_service
    return @json_validation_service if @json_validation_service

    permitted_fields = @permitted_form_fields_service.permitted_fields(
      authorized_roles, model_class.parent_form, module_unique_id, action_name
    )
    action_fields = @permitted_field_service.permitted_fields_schema(update?)
    @json_validation_service = RecordJsonValidatorService.new(fields: permitted_fields,
                                                              schema_supplement: action_fields)
  end

  def validate_json!
    json_validation_service.validate!(record_params)
  end

  def authorized_roles
    @authorized_roles ||= [current_user.role]
  end

  def permit_readable_fields
    @permitted_field_names = @permitted_field_service.permitted_field_names(
      module_unique_id, false, false, authorized_roles
    )
  end

  def select_fields_for_show
    @selected_field_names =
      FieldSelectionService.select_fields_to_show(params, model_class, @permitted_field_names, current_user)
  end

  def select_fields_for_index
    params_for_fields = params
    params_for_fields = { fields: 'short', id_search: true } if params[:id_search]
    @selected_field_names = FieldSelectionService.select_fields_to_show(
      params_for_fields, model_class, @permitted_field_names, current_user
    )
  end

  def select_updated_fields
    changes = @record.saved_changes_to_record.keys + @record.saved_changes.except('data', 'record_user_update').keys
    @updated_field_names = changes & @permitted_field_names
  end

  def record_params
    return @record_params.to_h if @record_params.present?

    if params[:data].present?
      strong_params = json_validation_service.strong_params
      @record_params = params.require(:data).permit(strong_params).to_h
      @record_params.to_h
    else
      # We send empty data when we add an attachment
      @record_params = {}
    end
  end

  def find_record
    record = model_class.find(params[:id])
    # Alias the record to a more specific name: @child, @incident, @tracing_request
    instance_variable_set("@#{model_class.name.underscore}", record)
  end

  def instantiate_app_services
    @record_data_service = RecordDataService.new
    @permitted_form_fields_service = PermittedFormFieldsService.instance
    @permitted_field_service = PermittedFieldService.new(
      current_user,
      model_class,
      @permitted_form_fields_service,
      { action_name: params[:record_action], id_search: params[:id_search] }
    )
  end

  def query_scope
    current_user.record_query_scope(model_class, params[:id_search])
  end

  def search_filters
    SearchFilterService.build_filters(index_params, @permitted_field_names)
  end

  def display_permitted_forms
    @display_permitted_forms = false
  end

  def module_unique_id
    return @record.module_id if @record.present?

    params.dig(:data, :module_id)
  end

  private

  def search_records
    search = PhoneticSearchService.search(
      model_class, {
        query: index_params[:query], phonetic: index_params[:phonetic], filters: search_filters,
        sort: sort_order, scope: query_scope, pagination:
      }
    )
    { total: search.total, records: search.records }
  rescue ActiveRecord::StatementInvalid => e
    Rails.logger.error(e)
    { total: 0, records: model_class.none }
  end

  def update?
    action_name == 'update'
  end

  def authorize_create!
    authorize! :create, model_class
  end

  def authorize_update!
    if params[:record_action].present?
      authorize!(params[:record_action].to_sym, model_class)
    else
      authorize!(:update, @record)
    end
  end

  def permitted_index_params(params)
    permitted_params = []
    params.each do |k, v|
      next unless @permitted_field_names.include?(strip_location_prefix(k))

      permitted_params << (v.is_a?(ActionController::Parameters) ? { k => {} } : k)
    end
    permitted_params
  end

  def strip_location_prefix(param)
    return Field.remove_location_parts(param) if Field.location_prefix?(param)

    param
  end
end
# rubocop:enable Metrics/ModuleLength
