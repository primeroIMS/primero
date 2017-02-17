class ChildrenController < ApplicationController
  @model_class = Child

  include IndexHelper
  include RecordFilteringPagination
  include ApprovalActions

  before_filter :filter_params_array_duplicates, :only => [:create, :update]
  #TODO: This should go away once filters are configurable in the role
  before_filter :filter_risk_level, :only => [:index]

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
    authorize! :update, @child
    @child.hidden_name = hide
    if @child.save
      render :json => {:error => false,
                       :input_field_text => hide ? I18n.t("cases.hidden_text_field_text") : @child['name'],
                       :disable_input_field => true,
                       :action_link_action => hide ? "view" : "protect",
                       :action_link_text => hide ? I18n.t("cases.view_name") : I18n.t("cases.hide_name")
                      }
    else
      puts @child.errors.messages
      render :json => {:error => true, :text => I18n.t("cases.hide_name_error"), :accept_button_text => I18n.t("cases.ok")}
    end
  end

  def create_incident
    authorize! :create, Incident
    child = Child.get(params[:child_id])
    #It is a GBV cases and the user indicate that want to create a GBV incident.
    redirect_to new_incident_path({:module_id => child.module_id, :case_id => child.id})
  end

  def reopen_case
    child = Child.get(params[:child_id])
    authorize! :update, child
    child.child_status = params[:child_status]
    child.case_status_reopened = params[:case_reopened]
    child.add_reopened_log(current_user.user_name)

    if child.save
      render :json => { :success => true, :error_message => "", :reload_page => true }
    else
      render :json => { :success => false, :error_message => child.errors.messages, :reload_page => true }
    end
  end

  def request_approval
    #TODO move business logic to the model.
    child = Child.get(params[:child_id])
    authorize! :update, child
    case params[:approval_type]
      when "bia"
        child.approval_status_bia = params[:approval_status]
      when "case_plan"
        child.approval_status_case_plan = params[:approval_status]
      when "closure"
        child.approval_status_closure = params[:approval_status]
      else
        render :json => {:success => false, :error_message => 'Unkown Approval Type', :reload_page => true }
    end

    if child.save
      render :json => { :success => true, :error_message => "", :reload_page => true }
    else
      render :json => { :success => false, :error_message => child.errors.messages, :reload_page => true }
    end
  end

  def relinquish_referral
    #TODO move business logic to the model.
    referral_id = params[:transition_id]
    child = Child.get(params[:id])

    # TODO: this may require its own permission in the future.
    authorize! :read, child

    active_transitions_count = child.referrals.select { |t| t.id != referral_id && t.is_referral_active? && t.is_assigned_to_user_local?(@current_user.user_name) }.count
    referral = child.referrals.select { |r| r.id == referral_id }.first

    # TODO: This will need to be refactored once we implement real i18n-able keyvalue pairs
    referral.to_user_local_status = I18n.t("referral.#{Transition::TO_USER_LOCAL_STATUS_DONE}", :locale => :en)

    if active_transitions_count == 0
      child.assigned_user_names = child.assigned_user_names.reject{|u| u == @current_user.user_name}
    end

    respond_to do |format|
      if child.save
        flash[:notice] = t("referral.done_success_message")
        redirect_to cases_path(scope: {:child_status => "list||Open", :record_state => "list||true"})
        return
      else
        flash[:notice] = child.errors.messages
        format.html { redirect_after_update }
      end
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

  def transfer_status
    authorize! :read, model_class

    @child = Child.get(params[:id])

    transfer_id = params[:transition_id]
    transition_status = params[:transition_status]

    respond_to do |format|
      status = @child.transitions_transfer_status(transfer_id, transition_status, @current_user, params[:rejected_reason])
      case status
        when :transition_unknown_transfer_status
          flash[:notice] = t('transfer.unknown_status', status: transition_status)
          format.html { redirect_after_update }
        when :transition_unknown_transfer
          flash[:notice] = t('transfer.unknown_transfer', record_type: model_class.parent_form.titleize, id: @child.short_id)
          format.html { redirect_after_update }
        when :transition_not_valid_transfer
          flash[:notice] = t('transfer.not_valid_transfer', record_type: model_class.parent_form.titleize, id: @child.short_id)
          format.html { redirect_after_update }
        when :transition_transfer_status_updated
          if @child.save
            if transition_status == I18n.t("transfer.#{Transition::TO_USER_LOCAL_STATUS_REJECTED}", :locale => :en)
              flash[:notice] = t('transfer.rejected', record_type: model_class.parent_form.titleize, id: @child.short_id)
              redirect_to cases_path(scope: {:child_status => "list||Open", :record_state => "list||true"})
              return
            else
              flash[:notice] = t('transfer.success', record_type: model_class.parent_form.titleize, id: @child.short_id)
              format.html { redirect_after_update }
            end
          else
            flash[:notice] = @child.errors.messages
            format.html { redirect_after_update }
          end
      end
    end
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
        child['estimated'] = individual_details['estimated'] = true
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

  def filter_risk_level
    @display_assessment ||= (can?(:view_assessment, Dashboard) || current_user.is_admin?)
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

  #Override method in LoggerActions.
  def logger_action_titleize
    if action_name == "hide_name"
      I18n.t("logger.hide_name.#{params[:protect_action]}", :locale => :en)
    else
      super
    end
  end

end
