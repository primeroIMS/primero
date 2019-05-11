module Api::V2::Concerns
  module Record
    extend ActiveSupport::Concern

    included do
      before_action :permit_fields
      before_action :select_fields, only: [:index, :show]
    end

    def index
      params.permit!
      search_filters = SearchFilterService.build_filters(params, @permitted_field_names)
      search = SearchService.search(
          model_class, search_filters, current_user.record_query_scope, params[:query],
          sort_order, pagination)
      @records = search.results
      @total = search.total
    end

    def show
    end

    def permit_fields
      @permitted_fields ||= current_user.permitted_fields(current_user.primero_modules, model_class.parent_form)
      @permitted_field_names ||= @permitted_fields.map(&:name)
    end

    #Move logic to FieldSelectionService
    def select_fields
      selected_field_names = nil
      if params[:fields] == 'short'
        selected_field_names = model_class.summary_field_names
      elsif params[:fields].present?
        selected_field_names = params[:fields].split(',')
      end
      if selected_field_names.present?
        @selected_field_names = selected_field_names & @permitted_field_names
      else
        @selected_field_names = @permitted_field_names
      end
    end

  end
end