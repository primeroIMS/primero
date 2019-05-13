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
    end

    def show
      authorize! :read, model_class
      @record = find_record
      authorize! :read, @record
    end

    def permit_fields
      @permitted_fields ||= current_user.permitted_fields(current_user.primero_modules, model_class.parent_form)
      @permitted_field_names ||= @permitted_fields.map(&:name)
    end

    def select_fields
      @selected_field_names = FieldSelectionService.select_fields_to_show(params, model_class, @permitted_field_names)
    end

    def find_record
      record = model_class.find(params[:id])
      # Alias the record to a more specific name: @child, @incident, @tracing_request
      instance_variable_set("@#{model_class.name.underscore}", record)
    end

  end
end