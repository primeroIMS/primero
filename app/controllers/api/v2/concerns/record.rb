# frozen_string_literal: true

# Shared code for all record-type controllers.
# This will be a long module, by it's nature,
# but we'll need to be careful to extract as much code as possible into services
# rubocop:disable Metrics/ModuleLength
module Api::V2::Concerns::Record
  extend ActiveSupport::Concern

  included do
    before_action :instantiate_app_services
    before_action :permit_params, only: %i[index create update]
    before_action :permit_fields
    before_action :select_fields_for_index, only: [:index]
    before_action :select_fields_for_show, only: [:show]
  end

  def index
    authorize! :index, model_class
    search = SearchService.search(
      model_class, filters: search_filters, query_scope: query_scope, query: params[:query],
                   sort: sort_order, pagination: pagination
    )
    @records = search.results
    @total = search.total
    render 'api/v2/records/index'
  end

  def show
    authorize! :read, model_class
    @record = find_record
    authorize! :read, @record
    render 'api/v2/records/show'
  end

  def create
    authorize_create! && validate_json!
    @record = model_class.new_with_user(current_user, record_params)
    @record.save!
    select_updated_fields
    status = params[:data][:id].present? ? 204 : 200
    render 'api/v2/records/create', status: status
  end

  def update
    @record = find_record
    authorize_update! && validate_json!
    @record.update_properties(current_user, record_params)
    @record.save!
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

  def permit_params
    # We do not use strong params for record updates but rely on:
    # 1. Validation against a generated JSON schema
    # 2. Intersection with a generated @permitted_field_name list
    params.permit!
  end

  def validate_json!
    permitted_fields = @permitted_form_fields_service.permitted_fields(
      current_user.role, model_class.parent_form, write?
    )
    action_fields = @permitted_field_service.permitted_fields_schema
    service = RecordJsonValidatorService.new(fields: permitted_fields, schema_supplement: action_fields)
    service.validate!(params[:data].to_h)
  end

  def permit_fields
    @permitted_field_names = @permitted_field_service.permitted_field_names(write?)
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
    changes = @record.saved_changes_to_record.keys
    @updated_field_names = changes & @permitted_field_names
  end

  def record_params
    record_params = params['data'].try(:to_h) || {}
    record_params.select { |k, _| @permitted_field_names.include?(k) }
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
      current_user, model_class, params[:record_action], params[:id_search], @permitted_form_fields_service
    )
  end

  def query_scope
    current_user.record_query_scope(model_class, params[:id_search])
  end

  def search_filters
    SearchFilterService.build_filters(params, @permitted_field_names)
  end

  private

  def write?
    action_name.in?(%w[create update])
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
end
# rubocop:enable Metrics/ModuleLength
