class FormSectionController < ApplicationController
  @model_class = FormSection

  include ExportActions
  include ImportActions
  include FormCustomization

  before_action :get_form_section, :only => [:edit, :destroy]
  before_action :load_form_sections, :only => [:index, :edit]
  before_action :get_lookups, :only => [:edit]

  include LoggerActions

  def index
    authorize! :index, FormSection
    @page_name = t("form_section.manage")

    respond_to do |format|
      format.html
      format.json do
        @form_sections = FormSection.format_forms_for_mobile(@form_sections, params[:locale], @parent_form) if (is_mobile? && @form_sections.present?)
        render json: @form_sections
      end
      #For now, forms are exported as part of the config bundle. They don't need individual exports.
      #respond_to_export(format, @form_sections.values.flatten)
    end
  end

  def new
    authorize! :create, FormSection
    @page_name = t("form_section.create")
    @form_section = FormSection.new(params[:form_section].to_h)
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
      redirect_to edit_form_section_path(id: form_section.unique_id, module_id: params[:module_id], parent_form: params[:parent_form])
    else
      get_form_groups
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
    @form_section = FormSection.get_by_unique_id(params[:id])
    @form_section.properties = params[:form_section].to_h
    if (@form_section.valid?)
      @form_section.save!
      redirect_to edit_form_section_path(
        id: @form_section.unique_id,
        module_id: params[:module_id],
        parent_form: params[:form_section][:parent_form])
    else
      get_form_groups
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
    form = FormSection.get_by_unique_id(params[:id])
    form.visible = !form.visible?
    form.save!
    render plain: 'OK'
  end

  def save_order
    authorize! :update, FormSection
    params[:ids].each_with_index do |unique_id, index|
      form_section = FormSection.get_by_unique_id(unique_id)
      form_section.order = index + 1
      form_section.save!
    end
    redirect_to form_sections_path
  end

  #TODO formatted_hash has issues related to Indonesia locale 'id' and locale 'ar-LB'
  # It is suspected this 'published' api action is a rapidFTR holdover and is not used by the mobile app
  # TODO LB-293 removing this method will be addressed in a later ticket.
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

  def is_mobile?
    @is_mobile ||= params[:mobile] == true || params[:mobile] == 'true'
  end

  def get_form_section
    @form_section = FormSection.get_by_unique_id(params[:id])
    @parent_form = @form_section.parent_form
  end

  def load_form_sections
    if @primero_module.present?
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

      permitted_forms = FormSection.get_permitted_form_sections(@primero_module, @parent_form, current_user)
      FormSection.link_subforms(permitted_forms)
      permitted_forms = FormSection.filter_subforms(permitted_forms)
      permitted_forms = FormSection.filter_for_mobile(permitted_forms) if is_mobile?
      @form_sections = FormSection.group_forms(permitted_forms)
    else
      @form_sections = []
    end
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
    @lookup_options = lookups.map{|lkp| [lkp.name, "lookup #{lkp.id}"]}
    @lookup_options.unshift("", "Location")
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
