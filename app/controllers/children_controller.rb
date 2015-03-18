class ChildrenController < ApplicationController
  @model_class = Child

  include IndexHelper
  include RecordFilteringPagination
  include TracingActions

  before_filter :filter_params_array_duplicates, :only => [:create, :update]

  include RecordActions #Note that order matters. Filters defined here are executed after the filters above

  def edit_photo
    authorize! :update, @child

    @page_name = t("child.edit_photo")
  end

  def update_photo
    authorize! :update, @child

    orientation = params[:child].delete(:photo_orientation).to_i
    if orientation != 0
      @child.rotate_photo(orientation)
      @child.last_updated_by = current_user_name
      @child.save
    end
    redirect_to(@child)
  end

# POST
  def select_primary_photo
    @child = Child.get(params[:child_id])
    authorize! :update, @child

    begin
      @child.primary_photo_id = params[:photo_id]
      @child.save
      head :ok
    rescue
      head :error
    end
  end

  def new_search
  end

  def hide_name
    if params[:protect_action] == "protect"
      hide = true
    elsif params[:protect_action] == "view"
      hide = false
    end
    child = Child.by_id(:key => params[:child_id]).first
    authorize! :update, child
    child.hidden_name = hide
    if child.save
      render :json => {:error => false,
                       :input_field_text => hide ? I18n.t("cases.hidden_text_field_text") : child['name'],
                       :disable_input_field => hide,
                       :action_link_action => hide ? "view" : "protect",
                       :action_link_text => hide ? I18n.t("cases.view_name") : I18n.t("cases.hide_name")
                      }
    else
      puts child.errors.messages
      render :json => {:error => true, :text => I18n.t("cases.hide_name_error"), :accept_button_text => I18n.t("cases.ok")}
    end
  end

  def create_incident
    authorize! :create, Incident
    child = Child.get(params[:child_id])
    #It is a GBV cases and the user indicate that want to create a GBV incident.
    redirect_to new_incident_path({:module_id => child.module_id, :case_id => child.id})
  end

  def exported_properties
    if params[:format].present? && (params[:format] == "xls" || params[:format] == "selected_xls" || params[:format] == "case_pdf")
      #get form sections the user is allow to see.
      form_sections = FormSection.get_form_sections_by_module(@current_modules, model_class.parent_form, current_user)
      #get the model properties based on the form sections.
      properties_by_module = model_class.get_properties_by_module(form_sections)
      #Clean up the forms.
      
      # TODO: Shouldn't be doing filtering by the display form name. This will be translated. should be filtering
      # by the form's id. This is also true in the filter_custom_exports method. This will need changes also in the 
      # exporters ...xls, selected_xls, and case_pdf...and maybe the others too.
      properties_by_module.each{|pm, fs| fs.reject!{|key| ["Photos and Audio", "Other Documents"].include?(key)}}

      properties_by_module = filter_custom_exports(properties_by_module)

      # Add other useful information for the report.
      properties_by_module.each{|pm, fs| properties_by_module[pm].merge!(model_class.record_other_properties_form_section)}

      properties_by_module
    else
      super
    end
  end

  def match_record
    load_tracing_request
    if @tracing_request.present? && @match_request.present?
      @match_request.matched_case_id = @child.id
      @child.matched_tracing_request_id = "#{@tracing_request.id}::#{@match_request.unique_id}"

      begin
        @tracing_request.save
        @child.save
        flash[:notice] = t("child.match_record_success")
      rescue
        flash[:notice] = t("child.match_record_failed")
      end
    else
      flash[:notice] = t("child.match_record_failed")
    end
    redirect_to case_path(@child)
  end

  private

  # A hack due to photos being submitted under an adhoc key
  def extra_permitted_parameters
    super + ['photo', 'audio']
  end

  def make_new_record
    incident_id = params['incident_id']
    individual_details_subform_section = params['individual_details_subform_section']

    Child.new.tap do |child|
      child.registration_date = Date.today
      child['record_state'] = true
      child['child_status'] = ["Open"]
      child['module_id'] = params['module_id']
      if incident_id.present? && individual_details_subform_section.present?
        incident = Incident.get(incident_id)
        individual_details = incident['individual_details_subform_section'][individual_details_subform_section.to_i]
        child['sex'] = individual_details['sex']
        child['date_of_birth'] = individual_details['date_of_birth']
        child['age'] = individual_details['age']
        child['estimated'] = individual_details['estimated'] == "Yes"
        child['ethnicity'] = [individual_details['ethnicity']]
        child['nationality'] = [individual_details['nationality']]
        child['religion'] = [individual_details['religion']]
        child['country_of_origin'] = individual_details['country_of_origin']
        child['displacement_status'] = individual_details['displacement_status']
        child['marital_status'] = individual_details['marital_status']
        child['disability_type'] = individual_details['disability_type']
      end
    end
  end

  def initialize_created_record rec
    rec['child_status'] = "Open" if rec['child_status'].blank?
    rec['hidden_name'] = true if params[:child][:module_id] == PrimeroModule::GBV
  end

  def redirect_after_update
    case_module = @child.module
    if params[:commit] == t("buttons.create_incident") and case_module.id == PrimeroModule::GBV
      #It is a GBV cases and the user indicate that want to create a GBV incident.
      redirect_to new_incident_path({:module_id => case_module.id, :case_id => @child.id})
    else
      redirect_to case_path(@child, { follow: true })
    end
  end

  def redirect_after_deletion
    redirect_to(children_url)
  end

  #TODO: We need to define the filter values as Constants
  def record_filter(filter)
    #The UNHCR report should retrieve only CP cases.
    filter["module_id"] = {:type => "single", :value => "#{PrimeroModule::CP}"} if params["format"] == "unhcr_csv"
    filter
  end

  def update_record_with_attachments(child)
    child_params = filter_params(child)
    new_photo = child_params.delete("photo")
    new_photo = (child_params[:photo] || "") if new_photo.nil?
    new_audio = child_params.delete("audio")
    child.last_updated_by_full_name = current_user_full_name
    delete_child_audio = params["delete_child_audio"].present?
    child.update_properties_with_user_name(current_user_name, new_photo, params["delete_child_photo"], new_audio, delete_child_audio, child_params)
    child
  end

end
