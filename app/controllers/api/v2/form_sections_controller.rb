module Api::V2
  class FormSectionsController < ApplicationApiController
    @model_class = FormSection

    before_action :permitted_forms, only: [:index, :show, :update, :destroy]

    def index
      authorize! :index, model_class
      params.permit!
    end

    def show
      authorize! :read, model_class
      @form_section = model_class.find(params[:id])
      authorize! :read, @form_section
      check_permitted_form(@form_section)
    end

    def create
      authorize! :create, model_class
      params.permit!
      @form_section = model_class.new(form_section_i18n_params)
      @form_section.fields = fields_i18n_params.map{ |f| Field.new(f) }
      @form_section.primero_modules = primero_modules
      @form_section.save!
      status = params[:data][:id].present? ? 204 : 200
      render 'api/v2/form_sections/create', status: status
    end

    def update
      authorize! :update, model_class
      @form_section = model_class.find(params[:id])
      authorize! :update, @form_section
      check_permitted_form(@form_section)
      params.permit!

      @form_section.merge_properties(form_section_i18n_params)
      @form_section.primero_modules = primero_modules if form_section_params.key?('module_ids')

      if form_section_params.key?('fields')
        if fields_i18n_params.present?
          @form_section.set_or_remove_fields!(fields_i18n_params)
        else
          # TODO: Should we delete fields if they are editable: false?
          @form_section.fields.each(&:destroy!)
        end
      end

      @form_section.save!
    end

    def destroy
      authorize! :enable_disable_record, model_class
      @form_section = model_class.find(params[:id])
      check_permitted_form(@form_section)
      @form_section.permitted_destroy!
    end

    def form_section_params
      DestringifyService.destringify(params['data'].try(:to_h) || {})
    end

    def form_section_i18n_params
      localized_form_params = FieldI18nService.convert_i18n_fields(FormSection, form_section_params)
      localized_form_params.reject{ |k,_|  ['fields', 'module_ids'].include?(k) }
    end

    def fields_i18n_params
      return [] if form_section_params['fields'].blank?
      form_section_params['fields'].map do |field_param| 
        FieldI18nService.convert_i18n_fields(Field, field_param)
      end
    end

    def primero_modules
      return [] if form_section_params['module_ids'].blank? 
      PrimeroModule.where(unique_id: form_section_params['module_ids'])
    end

    def permitted_forms
      primero_module = PrimeroModule.find_by(unique_id: params[:module_id]) if params[:module_id].present?
      user_permitted_forms = current_user.permitted_forms(primero_module, params[:record_type])
      @permitted_forms = user_permitted_forms + FormSection.get_subforms(user_permitted_forms)
    end

    def check_permitted_form(form_section)
      raise CanCan::AccessDenied.new unless permitted_forms.include?(form_section)
    end

  end
end
