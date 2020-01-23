module Api::V2::Concerns
  module Record
    extend ActiveSupport::Concern

    included do
      before_action :permit_fields
      before_action :select_fields_for_index, only: [:index]
      before_action :select_fields_for_show, only: [:show]
    end

    def index
      authorize! :index, model_class
      params.permit!
      search_filters = SearchFilterService.build_filters(params, @permitted_field_names)
      search = SearchService.search(
        model_class, search_filters, current_user.record_query_scope(model_class, params[:id_search]), params[:query],
        sort_order, pagination)
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
      authorize! :create, model_class
      params.permit!
      @record = model_class.new_with_user(current_user, record_params)
      @record.save!
      select_updated_fields
      status = params[:data][:id].present? ? 204 : 200
      render 'api/v2/records/create', status: status
    end

    def update
      @record = find_record
      begin
        authorize! :update, @record
      rescue CanCan::AccessDenied
        authorize_unscoped_update!
      end
      params.permit!
      @record.update_properties(record_params, current_user.name)
      @record.save!
      select_updated_fields
      render 'api/v2/records/update'
    end

    def destroy
      authorize! :enable_disable_record, model_class
      @record = find_record
      @record.update_properties({ record_state: false }, current_user.name)
      @record.save!
      render 'api/v2/records/destroy'
    end

    def permit_fields
      @permitted_field_names = current_user.permitted_field_names(model_class, unscoped_action)
    end

    def select_fields_for_show
      @selected_field_names =
        FieldSelectionService.select_fields_to_show(params, model_class, @permitted_field_names, current_user)
    end

    def select_fields_for_index
      params_for_fields = params
      if params[:id_search]
        params_for_fields = { fields: 'short', id_search: true }
      end
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
      record_params = DestringifyService.destringify(record_params)
      record_params.select{|k,_| @permitted_field_names.include?(k)}
    end

    def find_record
      record = model_class.find(params[:id])
      # Alias the record to a more specific name: @child, @incident, @tracing_request
      instance_variable_set("@#{model_class.name.underscore}", record)
    end

    def unscoped_action
      return 'unscoped_update' if params[:unscoped_update].present?
      if params[:data].present?
        return 'close' if params[:data][:status] == Child::STATUS_CLOSED && params[:data].keys.size == 1
        if params[:data].keys.size == 2 && params[:data][:status] == Child::STATUS_OPEN &&
           params[:data][:case_reopened] == true || params[:data][:case_reopened] == 'true'
          return 'reopen'
        end
      end
      action_name
    end

    def authorize_unscoped_update!
      case unscoped_action
      when 'unscoped_update'
        raise Errors::ForbiddenOperation unless current_user.can_update_subform_fields?(model_class)
      when 'close'
        raise Errors::ForbiddenOperation unless current_user.can?(:close, model_class)
      when 'reopen'
        raise Errors::ForbiddenOperation unless current_user.can?(:reopen, model_class)
      else
        raise Errors::ForbiddenOperation
      end
    end
  end
end
