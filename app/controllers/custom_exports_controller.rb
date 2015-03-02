class CustomExportsController < ApplicationController

  include ReportsHelper
  include ExportActions

  def permitted_forms_list
    # TODO: I don't think I'm actually pulling the permitted forms by user.
    module_id = (params[:module].present? && params[:module] != 'null') ? [params[:module]] : []
    record_type = params[:record_type]
    permitted_forms = PrimeroModule.all(keys: module_id).first.associated_forms
                                   .select{|sel| sel.parent_form == record_type}
                                   .map{|form| {name: form.name, id: form.unique_id}}

    render json: permitted_forms
  end

  def permitted_fields_list
    module_ids = (params[:module].present? && params[:module] != 'null') ? [params[:module]] : []
    modules = PrimeroModule.all(keys: module_ids).all
    record_type = params[:record_type]
    permitted_fields = select_options_fields_grouped_by_form(
      all_exportable_fields_by_form(modules, record_type, @current_user),
      true
    )
    render json: permitted_fields
  end

  private

  def all_exportable_fields_by_form(primero_modules, record_type, user)
    custom_exportable = {}
    if primero_modules.present?
      primero_modules.each do |primero_module|
        # TODO: Not sure if this violations stuff is needed.
        if record_type == 'violation'
          forms = FormSection.get_permitted_form_sections(primero_module, 'incident', user)
          violation_forms = FormSection.violation_forms
          forms = forms.select{|f| violation_forms.include?(f) || !f.is_nested?}
        else
          forms = FormSection.get_permitted_form_sections(primero_module, record_type, user)
          forms = forms.select{|f| !f.is_nested?}
        end
        forms = forms.sort_by{|f| [f.order_form_group, f.order]}
        forms = forms.map do |form|
          fields = form.fields.map{|f| [f.name, f.display_name, f.type]}
          [form.name, fields]
        end
        forms = forms.select{|f| f[1].present?}
        custom_exportable[primero_module.name] = forms
      end
    end
    return custom_exportable
  end
end