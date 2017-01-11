class FormSectionController < ApplicationController
  @model_class = FormSection

  include ExportActions
  include ImportActions
  include FormCustomization

  before_filter :get_form_section, :only => [:edit, :destroy]
  before_filter :get_related_form_sections, :only => [:index, :edit]
  before_filter :get_lookups, :only => [:edit]

  include LoggerActions

  def index
    authorize! :index, FormSection
    @page_name = t("form_section.manage")

    respond_to do |format|
      format.html
      format.json do
        #TODO: What about module and type parameters?
        if params[:mobile].present?
          @lookups = Lookup.all.all
          @locations = Location.all_names
          @form_sections = format_for_mobile(@form_sections, params[:locale], params[:parent_form])
        end
        render json: @form_sections
      end
      #For now, forms are exported as part of the config bundle. They don't need individual exports.
      #respond_to_export(format, @form_sections.values.flatten)
    end
  end

  def new
    authorize! :create, FormSection
    @page_name = t("form_section.create")
    @form_section = FormSection.new(params[:form_section])
  end

  def create
    authorize! :create, FormSection
    form_section = FormSection.new_custom params[:form_section], @primero_module.name

    if (form_section.valid?)
      form_section.create
      unless @primero_module.associated_form_ids.include? form_section.unique_id
        @primero_module.associated_form_ids << form_section.unique_id
        @primero_module.save
      end
      flash[:notice] = t("form_section.messages.updated")
      redirect_to edit_form_section_path(form_section.unique_id)
    else
      get_form_group_names
      @form_section = form_section
      render :new
    end
  end

  def edit
    authorize! :update, FormSection
    @page_name = t("form_section.edit")
    forms_for_move
  end

  def update
    authorize! :update, FormSection
    @form_section = FormSection.get_by_unique_id(params[:id], true)
    @form_section.properties = params[:form_section]
    if (@form_section.valid?)
      @form_section.save!
      redirect_to edit_form_section_path(@form_section.unique_id)
    else
      get_form_group_names
      render :action => :edit
    end
  end

  def destroy
    authorize! :destroy, Lookup
    @form_section.destroy
    redirect_to form_sections_path
  end

  def toggle
    authorize! :update, FormSection
    form = FormSection.get_by_unique_id(params[:id], true)
    form.visible = !form.visible?
    form.save!
    render :text => "OK"
  end

  def save_order
    authorize! :update, FormSection
    params[:ids].each_with_index do |unique_id, index|
      form_section = FormSection.get_by_unique_id(unique_id, true)
      form_section.order = index + 1
      form_section.save!
    end
    redirect_to form_sections_path
  end

  def published
    json_content = FormSection.find_all_visible_by_parent_form(@parent_form, true).map(&:formatted_hash).to_json
    respond_to do |format|
      format.html { render :inline => json_content }
      format.json { render :json => json_content }
    end
  end

  def download_all_forms
    authorize! :index, FormSection

    forms_exporter = Exporters::FormExporter.new
    type = params['parent_form']
    module_id = params['current_module']
    if type.present? && module_id.present?
      forms_exporter.export_forms_to_spreadsheet(type, module_id, false)
      hostname = request.env['SERVER_NAME']
      datetimenow = DateTime.now.strftime('%Y%m%d.%I%M')
      file_name = "forms-#{hostname}-#{datetimenow}.xls"

      cookies[:download_status_finished] = true
      send_file(
        forms_exporter.export_file,
        filename: file_name,
        type: 'application/excel',
        disposition: 'inline'
      )
    end
  end

  private

  def get_form_section
    @form_section = FormSection.get_by_unique_id(params[:id], true)
    @parent_form = @form_section.parent_form
  end

  def get_related_form_sections
    @record_types = @primero_module.associated_record_types

    if @parent_form.blank?
      #only use the passed in parent_form if it is in the allowed form types for this module
      #otherwise, default to the first allowed form type
      if (params[:parent_form].present? && (@record_types.include? params[:parent_form]))
        @parent_form = params[:parent_form]
      else
        @parent_form = @record_types.first
      end
    end

    permitted_forms = FormSection.get_permitted_form_sections(@primero_module, @parent_form, current_user, true)
    FormSection.link_subforms(permitted_forms, true)
    #filter out the subforms
    no_subforms = FormSection.filter_subforms(permitted_forms, true)
    @form_sections = FormSection.group_forms(no_subforms, true)
  end

  def forms_for_move
    form_list = []
    @form_sections.values.each do |form_group|
      form_list += form_group
    end
    @forms_for_move = form_list.sort_by{ |form| form.name || "" }.map{ |form| [form.name, form.unique_id] }
  end

  def get_lookups
    lookups = Lookup.get_all
    @lookup_options = lookups.map{|lkp| [lkp.name, "lookup #{lkp.name.gsub(' ', '_').camelize}"]}
    @lookup_options.unshift("", "Location")
  end

  def format_for_mobile(form_sections, locale_param=nil, parent_form_param=nil)
    #Flatten out the form sections, discarding form groups
    form_sections = form_sections.reduce([]){|memo, elem| memo + elem[1]}.flatten
    #Discard the non-mobile form sections
    form_sections = form_sections.select{|f| f.mobile_form?}
    #Transform the i18n values
    requested_locales = if locale_param.present? && Primero::Application::locales.include?(locale_param)
                          [locale_param]
                        else
                          Primero::Application::locales
                        end
    form_sections = form_sections.map do |form|
      attributes = convert_localized_form_properties(form, requested_locales)
      attributes['fields'] = form.fields.map do |f|
        field_hash = convert_localized_field(f, requested_locales)
        if f.subform.present?
          embed_subform(field_hash, f.subform, requested_locales)
        end
        field_hash
      end
      attributes
    end
    #Group by form type
    form_sections = form_sections.group_by { |f| mobile_form_type(f['parent_form']) }
    return simplify_form_content(form_sections, parent_form_param)
  end


  def simplify_form_content(form_sections, parent_form_param=nil)
    #Todo: write this block of code in a simple way
    if parent_form_param == 'case'
      for section in form_sections["Children"]
        section.slice!(:name, "order", :help_text, "base_language", "fields")
        section["fields"].delete_if { |i| i["mobile_visible"]==false }
        for field in section["fields"]
          field.slice!("name", "editable", "multi_select", "type", "subform", "required", "show_on_minify_form","mobile_visible", :display_name, :help_text, :option_strings_text)
          if field["type"] == "subform"
            field["subform"].slice!(:name, "order", :help_text, "base_language", "fields")
            field["subform"]["fields"].delete_if { |i| i["mobile_visible"]==false }
            for subfield in field["subform"]["fields"]
              subfield.slice!("name", "editable", "multi_select", "type", "required", "show_on_minify_form","mobile_visible", :display_name, :help_text, :option_strings_text)
            end
          end
        end
      end
    end
    return form_sections
  end

  def convert_localized_form_properties(form, requested_locales)
    attributes = form.attributes.clone
    #convert top level attributes
    FormSection.localized_properties.each do |property|
      attributes[property] = {}
      Primero::Application::locales.each do |locale|
        key = "#{property.to_s}_#{locale.to_s}"
        value = attributes[key].nil? ? "" : attributes[key]
        if requested_locales.include? locale
          attributes[property][locale] = value
        end
        attributes.delete(key)
      end
    end
    return attributes
  end

  def convert_localized_field(field, requested_locales)
    field_hash = field.attributes.clone
    Field.localized_properties.each do |property|
      field_hash[property] = {}
      Primero::Application::locales.each do |locale|
        key = "#{property.to_s}_#{locale.to_s}"
        value = field_hash[key]
        if property == :option_strings_text
          #value = field.options_list(@lookups) #TODO: This includes Locations. Imagine a situation with 4K locations, like Nepal?
          value = field.options_list(nil, @lookups, @locations)
        elsif field_hash[key].nil?
          value = ""
        end
        if requested_locales.include? locale
          field_hash[property][locale] = value
        end
        field_hash.delete(key)
      end
    end
    return field_hash
  end

  #TODO: Yeah, yeah, combine with format_for_mobile, make recursive
  def embed_subform(field_hash, subform, requested_locales)
    subform_hash = convert_localized_form_properties(subform, requested_locales)
    subform_hash['fields'] = subform.fields.map do |f|
      convert_localized_field(f, requested_locales)
    end
    field_hash['subform'] = subform_hash
  end

  #This keeps the forms compatible with the mobile API
  def mobile_form_type(parent_form)
    case parent_form
      when 'case'
        'Children'
      when 'child'
        'Children'
      when 'tracing_request'
        'Enquiries' #TODO: This may be controversial
      else
        parent_form.camelize.pluralize
    end
  end

  #Override method in LoggerActions.
  def logger_action_identifier
    if action_name == 'create' && params[:form_section].present?
      action_id = ""
      Primero::Application::locales.each do |locale|
        if params[:form_section]["name_#{locale}".to_sym].present?
          action_id = "#{logger_model_titleize} '" + params[:form_section]["name_#{locale}".to_sym] + "'"
          break
        end
      end
      action_id
    else
      super
    end
  end
end
