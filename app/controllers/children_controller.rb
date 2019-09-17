class ChildrenController < ApplicationController
  @model_class = Child

  include IndexHelper
  include RecordFilteringPagination
  include ApprovalActions
  #include FieldsHelper

  before_action :filter_params_array_duplicates, :only => [:create, :update]
  before_action :filter_params_by_permission, :only => [:create, :update]

  #TODO: This should go away once filters are configurable in the role
  before_action :filter_risk_level, :only => [:index]
  before_action :toggle_photo_indicators, :only => [:show]
  before_action :load_fields, :only => [:index]
  before_action :load_service_types, :only => [:index, :show]
  before_action :load_agencies, :only => [:index, :show]
  before_action :load_users_by_permission, :only => [:index, :show]

  include RecordActions #Note that order matters. Filters defined here are executed after the filters above

  def new_search
  end


  # def hide_name
  #   if params[:protect_action] == "protect"
  #     hide = true
  #   elsif params[:protect_action] == "view"
  #     hide = false
  #   end
  #   authorize! :update, @child
  #   @child.hidden_name = hide
  #   if @child.save
  #     render :json => {:error => false,
  #                      :input_field_text => hide ? I18n.t("cases.hidden_text_field_text") : @child.name,
  #                      :disable_input_field => hide,
  #                      :action_link_action => hide ? "view" : "protect",
  #                      :action_link_text => hide ? I18n.t("cases.view_name") : I18n.t("cases.hide_name")
  #                     }
  #   else
  #     puts @child.errors.messages
  #     render :json => {:error => true, :text => I18n.t("cases.hide_name_error"), :accept_button_text => I18n.t("cases.ok")}
  #   end
  # end

  def create_incident
    begin
      authorize! :create, Incident
    rescue CanCan::AccessDenied
      authorize! :incident_from_case, Child
    end
    from_module = params[:incident_detail_id].present? ? @child.module : nil
    to_module_id = from_module.present? && from_module.field_map_to_module_id.present? ? from_module.field_map_to_module_id : @child.module_id

    new_incident_params = {case_id: @child.id, module_id: to_module_id}
    if params[:incident_detail_id].present?
      new_incident_params[:incident_detail_id] = params[:incident_detail_id]
    end
    if from_module.present?
      new_incident_params[:from_module_id] = from_module.unique_id
    end

    if from_module.present? && params[:incident_detail_id].present?
      incident = Incident.new_incident_from_case(to_module_id, @child, from_module.unique_id, params[:incident_detail_id])
      incident.save

      content = {
        incident_link_label: t('incident.link_to_incident'),
        incident_link: view_context.link_to(incident.short_id, incident_path(incident.id))
      }
      json_content = content.to_json
      respond_to do |format|
        format.html {render :json => json_content}
        format.json {render :json => json_content}
      end
    else
      redirect_to new_incident_path(new_incident_params)
    end
  end

  def create_subform
    type = params['form_type']
    #TODO: we should have a tighter link between type and forms to avoid hacking since this is coming from javascript
    authorize! "#{type}_from_case".to_sym, Child
    form_id = params['form_id']
    form_sidebar_id = params['form_sidebar_id']
    subform_section = FormSection.find_by(unique_id: form_id)

    html = ChildrenController.new.render_to_string(partial: "children/create_subform", layout: false, locals: {
      child: @child,
      subform_section: subform_section,
      subform_name: type,
      form_group_name: '',
      form_link: child_save_subform_path(@child, subform: type, form_sidebar_id: form_sidebar_id),
      can_save_and_add_provision: can?(:services_section_from_case, model_class) &&
        can?(:service_provision_incident_details, model_class) && (type == 'incident_details'),
      is_mobile: is_mobile?
    })
    respond_to do |format|
      format.html {render plain: html}
    end
  end

  def save_subform
    subform = params['subform']
    form_sidebar_id = params['form_sidebar_id']
    authorize! "#{subform}_from_case".to_sym, Child
    new_subform = params['child'][subform]['template']
    new_subform['unique_id'] = Child.generate_unique_id
    @child[subform] << new_subform
    @child.update_last_updated_by(current_user)
    @child.add_alert(Alertable::NEW_FORM, subform, form_sidebar_id) if current_user.user_name != @child.owned_by
    if @child.status == Record::STATUS_CLOSED
      #@child.reopen(Record::STATUS_OPEN, true, current_user.user_name)
    end

    respond_to do |format|
      if @child.save
        format.html do
          flash[:notice] = I18n.t("child.messages.update_success", record_id: @child.short_id)
          redirect_to params[:redirect_to] ||= cases_path()
        end
        format.json { render :json => :ok }
      else
        format.json { render :json => :error }
      end
    end
  end

  def add_note
    authorize! :add_note, @record

    if @record.blank?
      flash[:notice] = t('notes.no_records_selected')
      redirect_back(fallback_location: root_path) and return
    end

    @record.add_note(params[:notes], params[:subject], current_user)
    if @record.save
      redirect_to polymorphic_path(@record, { follow: true })
    else
      flash[:notice] = t('notes.error_adding_note')
      redirect_back(fallback_location: root_path) and return
    end
  end

  def request_transfer_view
    authorize! :request_transfer, model_class

    html = ChildrenController.new.render_to_string(partial: "children/request_transfer", layout: false, locals: {
      child: @child,
    })

    respond_to do |format|
      format.html {render plain: html}
    end
  end

  def quick_view
    authorize! :display_view_page, model_class
    form_sections = @child.present? ? current_user.permitted_forms(@child.module, @child.class.parent_form, true) : nil

    html = ChildrenController.render('children/_quick_view', layout: false, locals: {
      child: @child,
      form_sections: form_sections,
      user: current_user,
      can_request_transfer: @can_request_transfer,
      can_view_photo: @can_view_photo
    })

    respond_to do |format|
      format.html {render plain: html}
    end
  end

  # def reopen_case
  #   authorize! :update, model_class
  #   @child.reopen(params[:status], params[:case_reopened], current_user.user_name)
  #   if @child.save
  #     render :json => { :success => true, :error_message => "", :reload_page => true }
  #   else
  #     render :json => { :success => false, :error_message => @child.errors.messages, :reload_page => true }
  #   end
  # end

  def relinquish_referral
    #TODO move Transition business logic to the model.
    referral_id = params[:transition_id]

    # TODO: this may require its own permission in the future.
    authorize! :read, @child

    active_transitions_count = @child.referrals.select { |t| t.id != referral_id && t.is_referral_active? && t.is_assigned_to_user_local?(@current_user.user_name) }.count
    referral = @child.referrals.select { |r| r.id == referral_id }.first

    referral.to_user_local_status = Transition::TO_USER_LOCAL_STATUS_DONE

    if active_transitions_count == 0
      @child.assigned_user_names = @child.assigned_user_names.reject{|u| u == @current_user.user_name}
    end

    respond_to do |format|
      if @child.save
        flash[:notice] = t("referral.done_success_message")
        redirect_to cases_path(scope: {:status => "list||#{Record::STATUS_OPEN}", :record_state => "list||true"})
        return
      else
        flash[:notice] = @child.errors.messages
        format.html { redirect_after_update }
      end
    end
  end

  def match_record
    load_tracing_request
    if @tracing_request.present? && @trace.present?
      @child.match_to_trace(@tracing_request, @trace)
      begin
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

  def load_tracing_request
    if params[:match].present?
      # Expect match input to be in format <tracing request id>::<tracing request subform unique id>
      match_param = params[:match].split("::")
      tracing_request_id = match_param.first
      trace_id = match_param.last
      @tracing_request = TracingRequest.find_by(id: tracing_request_id) if tracing_request_id.present?
      if @tracing_request.present? && trace_id.present?
        @trace = @tracing_request.traces(trace_id).first
      end
    end
  end

  def load_fields
    @sex_field = Field.get_by_name('sex')
    @agency_offices = Lookup.values('lookup-agency-office')
    @user_group_ids = UserGroup.all.ids
  end

  def transfer_status
    authorize! :read, model_class

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
            if transition_status == Transition::TO_USER_LOCAL_STATUS_REJECTED
              flash[:notice] = t('transfer.rejected', record_type: model_class.parent_form.titleize, id: @child.short_id)
              redirect_to cases_path(scope: {:status => "list||#{Record::STATUS_OPEN}", :record_state => "list||true"})
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

  #override method in record_actions to handle instances that use child_id instead of id
  # TODO: When does this happen?
  def load_record
    if params[:child_id].present?
      @record = Child.find(params[:child_id])
      instance_variable_set("@child", @record)
    else
      super
    end
  end

  private

  # A hack due to photos being submitted under an adhoc key
  def extra_permitted_parameters
    super + ['photo', 'audio']
  end

  def make_new_record
    incident_id = params['incident_id']
    individual_details_subform_section_number = params['individual_details_subform_section'].try(:to_i)

    Child.new.tap do |child|
      child.module_id = params['module_id']
      if incident_id.present? && individual_details_subform_section_number.present?
        incident = Incident.find_by(id: incident_id)
        individual_details = incident.individual_details_subform_section[individual_details_subform_section_number]
        child.sex = individual_details['sex']
        child.date_of_birth = individual_details['date_of_birth']
        child.age = individual_details['age']
        child.estimated = individual_details['estimated'] = true
        child.ethnicity = [individual_details['ethnicity']]
        child.nationality = [individual_details['nationality']]
        child.religion = [individual_details['religion']]
        child.country_of_origin = individual_details['country_of_origin']
        child.displacement_status = individual_details['displacement_status']
        child.marital_status = individual_details['marital_status']
        child.disability_type = individual_details['disability_type']
      end
    end
  end

  def redirect_after_update
    case_module = @child.module
    if params[:commit] == t("buttons.create_incident") and case_module.unique_id == PrimeroModule::GBV
      #It is a GBV cases and the user indicate that want to create a GBV incident.
      redirect_to new_incident_path({:module_id => case_module.unique_id, :case_id => @child.id})
    else
      redirect_to case_path(@child, { follow: true })
    end
  end

  def redirect_after_deletion
    redirect_to(children_url)
  end

  def redirect_to_list
    redirect_to cases_path(scope: {:status => "list||#{Record::STATUS_OPEN}", :record_state => "list||true"})
  end

  #TODO: We need to define the filter values as Constants
  def record_filter(filter)
    #The UNHCR report should retrieve only CP cases.
    filter["module_id"] = {:type => "single", :value => "#{PrimeroModule::CP}"} if params["format"] == "unhcr_csv"
    filter
  end

  def filter_risk_level
    @display_assessment ||= (can?(:view_assessment, Dashboard) || current_user.admin?)
  end

  #Override method in AuditLogActions.
  def logger_action_name
    if action_name == "hide_name"
      "hide_name.#{params[:protect_action]}"
    else
      super
    end
  end

  def toggle_photo_indicators
    @has_photo_form = FormSection.has_photo_form
  end

  def load_service_types
    @service_types = Lookup.values_for_select('lookup-service-type')
  end

  #TODO: Refactor with Agency or UIUX. Is this even getting called?
  def load_agencies
    @agencies = Agency.all.map { |agency| [agency.name, agency.id] }
  end

  def load_users_by_permission
    if can?(:assign, Child)
      @user_can_assign = true
      users = User.list_by_enabled
    elsif can?(:assign_within_agency, Child)
      @user_can_assign = true
      criteria = { disabled: false, organization: current_user.organization }
      pagination = { page: 1, per_page: User.all.count }
      sort = { user_name: :asc}
      users = User.find_by_criteria(criteria, pagination, sort).try(:results) || []
    elsif can?(:assign_within_user_group, Child)
      @user_can_assign = true
      users = User.by_user_group(current_user.user_group_ids).list_by_enabled
    else
      @user_can_assign = false
      users = []
    end
    @assignable_users = users.reject { |user| user.user_name == current_user.user_name }.map { |user| [user.user_name, user.user_name] }
  end
end
