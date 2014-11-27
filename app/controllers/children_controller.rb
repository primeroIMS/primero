class ChildrenController < ApplicationController
  @model_class = Child

  include IndexHelper
  include RecordFilteringPagination

  before_filter :load_record_or_redirect, :only => [ :show, :edit, :destroy, :edit_photo, :update_photo, :match_record ]
  before_filter :load_tracing_request, :only => [:index, :match_record]
  before_filter :sanitize_params, :only => [:update, :sync_unverified]
  before_filter :filter_params_array_duplicates, :only => [:create, :update]

  include RecordActions #Note that order matters. Filters defined here are executed after the filters above

  # GET /children
  # GET /children.xml
  def index
    authorize! :index, Child

    @page_name = t("home.view_records")
    @aside = 'shared/sidebar_links'
    @associated_users = current_user.managed_user_names
    @children, @total_records = retrieve_records_and_total(case_filter(filter))
    @per_page = per_page

    # TODO: Ask Pavel about highlighted fields. This is slowing everything down. May need some caching or lower page limit
    # index average 400ms to 600ms without and 1000ms to 3000ms with.
    @highlighted_fields = FormSection.sorted_highlighted_fields
    #@highlighted_fields = []

    respond_to do |format|
      format.html
      format.xml { render :xml => @children }
      unless params[:format].nil?
        if @children.empty?
          flash[:notice] = t('exports.no_records')
          redirect_to :action => :index and return
        end
      end
      respond_to_export format, @children
    end
  end

  # GET /children/1
  # GET /children/1.xml
  def show
    authorize! :read, @child
    @page_name = t "case.view", :short_id => @child.short_id
    @body_class = 'profile-page'
    @duplicates = Child.duplicates_of(params[:id])

    respond_to do |format|
      format.html
      format.xml { render :xml => @child }

      respond_to_export format, [ @child ]
    end
  end

  # GET /children/new
  # GET /children/new.xml
  def new
    authorize! :create, Child

    @page_name = t("cases.register_new_case")
    @child = Child.new
    @child.registration_date = Date.today
    @child['record_state'] = true
    @child['child_status'] = ["Open"]
    @child['module_id'] = params['module_id']

    get_form_sections

    respond_to do |format|
      format.html
      format.xml { render :xml => @child }
    end
  end

  # GET /children/1/edit
  def edit
    authorize! :update, @child

    @page_name = t("case.edit")
  end

  # POST /children
  # POST /children.xml
  def create
    authorize! :create, Child
    params[:child] = JSON.parse(params[:child]) if params[:child].is_a?(String)
    reindex_hash params['child']
    create_or_update_child(params[:id], params[:child])
    params[:child][:photo] = params[:current_photo_key] unless params[:current_photo_key].nil?
    @child['child_status'] = "Open" if @child['child_status'].blank?
    @child['hidden_name'] = true if params[:child][:module_id] == PrimeroModule::GBV
    respond_to do |format|
      if @child.save
        flash[:notice] = t('child.messages.creation_success', record_id: @child.short_id)
        format.html { redirect_to(case_path(@child, { follow: true })) }
        format.xml { render :xml => @child, :status => :created, :location => @child }
      else
        format.html {
          @form_sections = get_form_sections

          # TODO: (Bug- https://quoinjira.atlassian.net/browse/PRIMERO-161) This render redirects to the /children url instead of /cases
          render :action => "new"
        }
        format.xml { render :xml => @child.errors, :status => :unprocessable_entity }
      end
    end
  end

  def sync_unverified
    params[:child] = JSON.parse(params[:child]) if params[:child].is_a?(String)
    params[:child][:photo] = params[:current_photo_key] unless params[:current_photo_key].nil?
    unless params[:child][:_id]
      respond_to do |format|
      end
    else
      child = Child.get(params[:child][:_id])
      child = update_child_with_attachments child, params
      child.save
      render :json => child.compact.to_json
    end
  end

  def update
    respond_to do |format|
      format.html do
        @child = update_child_from(params[:id], params[:child])
        @child['child_status'] = "Open" if @child['child_status'].blank?

        if @child.save
          flash[:notice] = I18n.t("case.messages.update_success", record_id: @child.short_id)
          return redirect_to "#{params[:redirect_url]}?follow=true" if params[:redirect_url]
          case_module = @child.module
          if params[:commit] == t("buttons.create_incident") and case_module.id == PrimeroModule::GBV
            #It is a GBV cases and the user indicate that want to create a GBV incident.
            redirect_to new_incident_path({:module_id => case_module.id, :case_id => @child.id})
          else
            redirect_to case_path(@child, { follow: true })
          end
        else
          @form_sections = get_form_sections

          # TODO: (Bug- https://quoinjira.atlassian.net/browse/PRIMERO-161) This render redirects to the /children url instead of /cases
          render :action => "edit"
        end
      end

      format.xml do
        @child = update_child_from(params[:id], params[:child])
        if @child.save
          head :ok
        else
          render :xml => @child.errors, :status => :unprocessable_entity
        end
      end
    end
  end

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

  #TODO: We need to define the filter values as Constants
  def case_filter(filter)
    #The UNHCR report should retrieve only CP cases.
    filter["module_id"] = {:type => "single", :value => "#{PrimeroModule::CP}"} if params["format"] == "unhcr_csv"
    filter["child_status"] ||= {:type => "single", :value => "open"}
    filter
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

# DELETE /children/1
# DELETE /children/1.xml
  def destroy
    authorize! :destroy, @child
    @child.destroy

    respond_to do |format|
      format.html { redirect_to(children_url) }
      format.xml { head :ok }
    end
  end

  def exported_properties
    if params[:export_list_view].present? && params[:export_list_view] == "true"
      build_list_field_by_model(model_class)
    elsif params[:format].present? && params[:format] == "xls"
      #get form sections the user is allow to see.
      form_sections = FormSection.get_form_sections_by_module(@current_modules, model_class.parent_form, current_user)
      #get the model properties based on the form sections.
      properties_by_module = model_class.get_properties_by_module(form_sections)
      #Clean up the forms.
      properties_by_module.each{|pm, fs| fs.reject!{|key| ["Photos and Audio", "Other Documents"].include?(key)}}
      # Add other useful information for the report.
      properties_by_module.each{|pm, fs| properties_by_module[pm].merge!(model_class.record_other_properties_form_section)}
      properties_by_module
    else
      model_class.properties
    end
  end

  def match_record
    #TODO WIP
    if @tracing_request.present? && @match_request.present?
      @match_request.matched_case_id = @child.id
      @child.matched_tracing_request_id = "#{@tracing_request.id}::#{@match_request.unique_id}"

      #TODO - add some error checking
      @tracing_request.save
      @child.save
      flash[:notice] = t("child.match_record_success")
    else
      flash[:notice] = t("child.match_record_failed")
    end
    redirect_to case_path(@child)
  end

  private

  def child_short_id child_params
    child_params[:short_id] || child_params[:unique_identifier].last(7)
  end

  def create_or_update_child(id, child_params)
    @child = Child.by_short_id(:key => child_short_id(child_params)).first if child_params[:unique_identifier]
    if @child.nil?
      @child = Child.new_with_user_name(current_user, child_params)
    else
      @child = update_child_from(id, child_params)
    end
  end

  def sanitize_params
    child_params = params['child']
    child_params['histories'] = JSON.parse(child_params['histories']) if child_params and child_params['histories'].is_a?(String) #histories might come as string from the mobile client.
  end

  def load_record_or_redirect
    @child = Child.get(params[:id])

    if @child.nil?
      respond_to do |format|
        format.html do
          flash[:error] = "Child with the given id is not found"
          redirect_to :action => :index and return
        end
      end
    end
  end

  def load_tracing_request
    if params[:match].present?
      # Expect match input to be in format <tracing request id>::<tracing request subform unique id>
      tracing_request_id = params[:match].split("::").first
      subform_id = params[:match].split("::").last
      @tracing_request = TracingRequest.get(tracing_request_id) if tracing_request_id.present?
      if @tracing_request.present? && subform_id.present?
        @match_request = @tracing_request.tracing_request_subform_section.select{|tr| tr.unique_id == subform_id}.first
      end
    end
  end

  def update_child_from(id, child_params)
    child = @child || Child.get(id) || Child.new_with_user_name(current_user, child_params)
    authorize! :update, child

    reindex_hash child_params
    update_child_with_attachments(child, params)
  end

  def update_child_with_attachments(child, params)
    new_photo = params[:child].delete("photo")
    new_photo = (params[:child][:photo] || "") if new_photo.nil?
    new_audio = params[:child].delete("audio")
    child.last_updated_by_full_name = current_user_full_name
    delete_child_audio = params["delete_child_audio"].present?
    child.update_properties_with_user_name(current_user_name, new_photo, params["delete_child_photo"], new_audio, delete_child_audio, params[:child])
    child
  end

end
