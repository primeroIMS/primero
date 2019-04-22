class CustomExportsController < ApplicationController

  include ReportsHelper
  include ExportActions
  include Exporters

  before_action :get_modules

  def permitted_forms_list
    record_type = params[:record_type]
    permitted_forms = get_permited_forms(@modules, record_type, @current_user)
    if params[:only_parent].present?
      permitted_forms = permitted_forms.select{|form| !form.is_nested && params[:only_parent].present? }
    end
    permitted_forms = permitted_forms.map{|form| {name: form.name, id: form.is_nested ? "subf:#{form.unique_id}" : form.unique_id}}
    render json: permitted_forms
  end

  def permitted_fields_list
    record_type = params[:record_type]
    permitted_fields = select_options_fields_grouped_by_form(
      FormSection.all_exportable_fields_by_form(@modules, record_type, @current_user, BaseExporter::EXPORTABLE_FIELD_TYPES),
      true
    )
    render json: permitted_fields
  end

  private

  def get_permited_forms(primero_module, record_type, user)
    #Use the same strategy as the ChildrenController, IncidentController and TracingRequestController
    #to retrieve the list of permitted forms sections.
    permitted_forms = FormSection.get_allowed_visible_forms_sections(primero_module, record_type, user)
    #Need a plain structure.
    permitted_forms = permitted_forms.map{|fsk, forms_sections| forms_sections}.flatten
    #Filter forms sections with exportable fields.
    permitted_forms.select{|form_section| form_section.fields.any?{|er| BaseExporter::EXPORTABLE_FIELD_TYPES.include?(er.type)}}
  end

  def get_modules
    @modules = []
    @modules = PrimeroModule.find(params[:module]) if params[:module].present?
    @modules
  end

end
