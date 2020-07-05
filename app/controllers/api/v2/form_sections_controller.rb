module Api::V2
  class FormSectionsController < ApplicationApiController
    before_action :form_section_params, only: [:create, :update]

    def index
      authorize! :index, FormSection
      @form_sections = FormSection.list(params)
      @form_group_lookups = FormSection.form_group_lookups
    end

    def show
      authorize! :read, FormSection
      @form_section = FormSection.find(params[:id])
    end

    def create
      authorize! :create, FormSection
      @form_section = FormSection.new_with_properties(form_section_properties, @form_section_params['module_ids'])
      @form_section.save!
      status = params[:data][:id].present? ? 204 : 200
      render :create, status: status
    end

    def update
      authorize! :update, FormSection
      @form_section = FormSection.find(params[:id])
      @form_section.merge_properties(form_section_properties, @form_section_params['module_ids'])
      @form_section.save!
    end

    def destroy
      authorize! :enable_disable_record, FormSection
      @form_section = FormSection.find(params[:id])
      @form_section.permitted_destroy!
      @form_section.destroy!
    end

    protected

    def form_section_params
      nested_props = [{"fields" => [Field.permitted_api_params]}, {"module_ids" => []}]
      @form_section_params = params.require(:data).permit(FormSection.permitted_api_params + nested_props)
    end

    def form_section_properties
      form_section_props = @form_section_params.reject{ |k, _|  ['fields', 'module_ids'].include?(k) }
      formi18n_props = FieldI18nService.convert_i18n_properties(FormSection, form_section_props)
      if form_section_params.key?('fields')
        formi18n_props['fields_attributes'] = (@form_section_params['fields'] || []).map do |field_param|
            FieldI18nService.convert_i18n_properties(Field, field_param)
        end
      end
      formi18n_props
    end

    def model_class
      FormSection
    end
  end
end
