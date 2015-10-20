class CustomExportsController < ApplicationController

  include ReportsHelper
  include ExportActions

  EXPORTABLE_FIELD_TYPES = [
      Field::TEXT_FIELD,
      Field::TEXT_AREA,
      Field::RADIO_BUTTON,
      Field::SELECT_BOX,
      Field::CHECK_BOXES,
      Field::NUMERIC_FIELD,
      Field::DATE_FIELD,
      Field::DATE_RANGE,
      Field::TICK_BOX,
      Field::TALLY_FIELD,
      Field::SUBFORM
  ]

  def permitted_forms_list
    module_id = (params[:module].present? && params[:module] != 'null') ? [params[:module]] : []
    record_type = params[:record_type]
    modules = PrimeroModule.all(keys: module_id).first
    permitted_forms = get_permited_forms(modules, record_type, current_user)
    if params[:only_parent].present?
      permitted_forms = permitted_forms.select{|form| !form.is_nested && params[:only_parent].present? }
    end
    permitted_forms = permitted_forms.map{|form| {name: form.name, id: form.is_nested ? "subf:#{form.unique_id}" : form.name}}
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

  def allowed_formsections(modules, record_type, user)
    instance = (record_type == "case" ? "Child" : record_type).classify.safe_constantize.new
    instance['module_id'] = modules.id
    #Use the same strategy as the ChildrenController, IncidentController and TracingRequestController
    #to retrieve the list of permitted forms sections.
    instance.allowed_formsections(user).map{|fsk, forms_sections| forms_sections}.flatten
  end

  def get_permited_forms(modules, record_type, user)
    permitted_forms = allowed_formsections(modules, record_type, user)
    #Filter forms sections with exportable fields.
    permitted_forms.select{|form_section| form_section.fields.any?{|er| EXPORTABLE_FIELD_TYPES.include? er.type}}
  end

  def all_exportable_fields_by_form(primero_modules, record_type, user, types=EXPORTABLE_FIELD_TYPES)
    readonly_user = user.readonly?(record_type)
    custom_exportable = {}
    if primero_modules.present?
      primero_modules.each do |primero_module|
        # TODO: Not sure if this violations stuff is needed.
        if record_type == 'violation'
          forms = allowed_formsections(primero_module, 'incident', user)
          violation_forms = FormSection.violation_forms
          forms = forms.select{|f| violation_forms.include?(f) || !f.is_nested?}
        else
          forms = allowed_formsections(primero_module, record_type, user)
          forms = forms.select{|f| !f.is_nested?}
        end
        #Collect the information as: [[form name, fields list], ...].
        #fields list got the format: [field name, display name, type].
        #fields list for subforms got the format: [subform name:field name, display name, type]
        #Subforms will appears as another section because there is no way
        #to manage nested optgroup in choosen or select.
        forms_and_fields = []
        forms.sort_by{|f| [f.order_form_group, f.order]}.each do |form|
          fields = []
          subforms = []
          form.fields.select{|f| types.include?(f.type) && f.visible?}.each do |f|
            if f.type == Field::SUBFORM
              if f.subform_section.present?
                #Collect subforms fields to build the section.
                subform_fields = f.subform_section.fields.select{|sf| types.include?(sf.type) && sf.visible?}
                subform_fields = subform_fields.map do |sf|
                  ["#{f.name}:#{sf.name}", sf.display_name, sf.type] if !readonly_user || (readonly_user && !sf.hide_on_view_page)
                end
                subforms << ["#{form.name}:#{f.display_name}", subform_fields.compact]
              end
            else
              #Not subforms fields.
              fields << [f.name, f.display_name, f.type] if !readonly_user || (readonly_user && !f.hide_on_view_page)
            end
          end
          #Add the section for the current form and the not subforms fields.
          forms_and_fields << [form.name, fields]
          #For every subform add the section as well.
          subforms.each{|subform| forms_and_fields << subform}
        end
        forms_and_fields = forms_and_fields.select{|f| f[1].present?}
        custom_exportable[primero_module.name] = forms_and_fields
      end
    end
    return custom_exportable
  end
end