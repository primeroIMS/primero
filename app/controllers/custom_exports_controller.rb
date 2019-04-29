class CustomExportsController < ApplicationController

  include ReportsHelper
  include ExportActions
  include Exporters

  before_action :get_modules

  def permitted_forms_list
    record_type = params[:record_type]
    permitted_forms = @current_user.permitted_forms(@modules, record_type)
                                   .select{ |fs| fs.fields.any?{|er| BaseExporter::EXPORTABLE_FIELD_TYPES.include?(er.type)} }
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

  def get_modules
    @modules = []
    @modules = PrimeroModule.find(params[:module]) if params[:module].present?
    @modules
  end

end
