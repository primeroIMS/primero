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

    def create
      authorize! :create, model_class
      @record = model_class.find_by(id: params[:data][:id]) if params[:data][:id]
      if @record.nil?
        params.permit!
        @record = model_class.new_with_user(current_user, record_params)
        if @record.save
          status = params[:data][:id].present? ? 204 : 200
          render :create, status: status
        else
          @errors = @record.errors.messages.map do |field_name, message|
            ApplicationError.new(
                code: 422,
                message: message,
                resource: request.path,
                detail: field_name.to_s
            )
          end
          render 'api/v2/errors/errors', status: 422
        end
      else
        @errors = [
          ApplicationError.new(
              code: 409,
              message: 'Conflict: A record with this unique_identifier already exists',
              resource: request.path
          )
        ]
        render 'api/v2/errors/errors', status: 409
      end
    end

    def update
      authorize! :update, model_class
      @record = find_record
      authorize! :update, @record
      params.permit!
      append_only_fields = params[:append_only_fields]
      @record.update_properties(record_params, current_user.name, append_only_fields)
      if @record.save
        render :update
      else
        @errors = @record.errors.messages.map do |field_name, message|
          ApplicationError.new(
              code: 422,
              message: message,
              resource: request.path,
              detail: field_name.to_s
          )
        end
        render 'api/v2/errors/errors', status: 422
      end



    end

    def permit_fields
      @permitted_fields ||= current_user.permitted_fields(current_user.primero_modules, model_class.parent_form)
      @permitted_field_names ||= ['id'] + @permitted_fields.map(&:name)
    end

    def select_fields
      @selected_field_names = FieldSelectionService.select_fields_to_show(params, model_class, @permitted_field_names)
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