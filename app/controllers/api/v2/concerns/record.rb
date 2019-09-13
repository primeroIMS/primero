module Api::V2::Concerns
  module Record
    extend ActiveSupport::Concern

    included do
      before_action :permit_fields
      before_action :select_fields, only: [:index, :show]
    end

    def index
      authorize! :index, model_class
      params.permit!
      search_filters = SearchFilterService.build_filters(params, @permitted_field_names)
      search = SearchService.search(
        model_class, search_filters, current_user.record_query_scope(model_class), params[:query],
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
      authorize! :update, model_class
      @record = find_record
      authorize! :update, @record
      params.permit!
      @record.update_properties(record_params, current_user.name)
      @record.save!
      select_updated_fields
      render 'api/v2/records/update'
    end

    def destroy
      authorize! :enable_disable_record, model_class
      @record = find_record
      @record.update_properties({record_state: false}, current_user.name)
      @record.save!
      render 'api/v2/records/destroy'
    end

    def permit_fields
      @permitted_field_names = current_user.permitted_field_names(current_user.primero_modules, model_class)
    end

    def select_fields
      @selected_field_names = FieldSelectionService.select_fields_to_show(params, model_class, @permitted_field_names)
    end

    def select_updated_fields
      changes = @record.saved_changes_to_record.keys
      @updated_field_names = changes & @permitted_field_names
    end

    def record_params
      record_params = params['data'].try(:to_h) || {}
      record_params = DestringifyService.destringify(record_params)
      record_params.select{|k,_| @permitted_field_names.include?(k)}.to_h
    end

    def find_record
      record = model_class.find(params[:id])
      # Alias the record to a more specific name: @child, @incident, @tracing_request
      instance_variable_set("@#{model_class.name.underscore}", record)
    end

  end
end