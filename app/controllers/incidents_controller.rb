class IncidentsController < ApplicationController
  @model_class = Incident

  include RecordFilteringPagination

  before_filter :load_record_or_redirect, :only => [ :show, :edit, :destroy ]
  #TODO: Do we need to sanitize params?
  #TODO: Dp we need to filter_params_array_duplicates?

  include RecordActions

  def index
    authorize! :index, Incident

    @page_name = t("home.view_records")
    @aside = 'shared/sidebar_links'

    @associated_users = current_user.managed_user_names
    @incidents, @total_records = retrieve_records_and_total(filter)
    @per_page = per_page

    # TODO: Ask Pavel about highlighted fields. This is slowing everything down. May need some caching or lower page limit
    # index average 400ms to 600ms without and 1000ms to 3000ms with.
    #@highlighted_fields = FormSection.sorted_highlighted_fields
    @highlighted_fields = []

    respond_to do |format|
      format.html
      format.xml { render :xml => @incidents }
      unless params[:format].nil?
        if @incidents.empty?
          flash[:notice] = t('exports.no_records')
          redirect_to :action => :index and return
        end
      end

      respond_to_export format, @incidents
    end
  end


  def show
    authorize! :read, @incident
    @page_name = t "incident.view", :short_id => @incident.short_id
    @body_class = 'profile-page'
    @duplicates = Incident.duplicates_of(params[:id])

    respond_to do |format|
      format.html
      format.xml { render :xml => @incident }

      respond_to_export format, [ @incident ]
    end
  end

  def new
    authorize! :create, Incident

    @page_name = t("incidents.register_new_incident")
    @incident = Incident.new
    @incident['record_state'] = true
    @incident['mrm_verification_status'] = "Pending"
    @incident['module_id'] = params['module_id']
    @incident['status'] = "Open"

    if params['case_id'].present?
      case_record = Child.get(params['case_id'])
      if case_record.present?
         @incident.copy_survivor_information(case_record)
      end
    end

    get_form_sections

    respond_to do |format|
      format.html
      format.xml { render :xml => @incident }
    end
  end

  def edit
    authorize! :update, @incident

    @page_name = t("incident.edit")
  end

  def create
    authorize! :create, Incident
    params[:incident] = JSON.parse(params[:incident]) if params[:incident].is_a?(String)
    params['incident']['violations'].compact if params['incident'].present? && params['incident']['violations'].present?
    reindex_hash params['incident']

    create_or_update_incident(params[:incident])
    @incident['status'] = "Open" if @incident['status'].blank?

    respond_to do |format|
      if @incident.save
        flash[:notice] = t('incident.messages.creation_success', record_id: @incident.short_id)
        format.html { redirect_to(incident_path(@incident, { follow: true })) }
        #format.xml { render :xml => @incident, :status => :created, :location => @child }
      else
        format.html {
          @form_sections = get_form_sections

          render :action => "new"
        }
        format.xml { render :xml => @incident.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    if params['incident'].present? && params['incident']['violations'].present?
      violations_subforms_control_keys = []
      # Save the keys for control inputs created when removing the last violation subform.
      params['incident']['violations'].each_key { |key| violations_subforms_control_keys << key if params['incident']['violations'][key].is_a? String }
      params['incident']['violations'].compact
      violations_subforms_control_keys.each {|key| params['incident']['violations'][key] = ""}
    end

    respond_to do |format|
      format.html do
        @incident = update_incident_from params
        @incident['status'] = "Open" if @incident['status'].blank?
        if @incident.save
          flash[:notice] = I18n.t("incident.messages.update_success", record_id: @incident.short_id)
          return redirect_to "#{params[:redirect_url]}?follow=true" if params[:redirect_url]
          redirect_to incident_path(@incident, { follow: true })
        else
          @form_sections = get_form_sections

          render :action => "edit"
        end
      end

      format.xml do
        @incident = update_incident_from params
        if @incident.save
          head :ok
        else
          render :xml => @incident.errors, :status => :unprocessable_entity
        end
      end
    end
  end

  def destroy
    authorize! :destroy, @incident
    @incident.destroy

    respond_to do |format|
      format.html { redirect_to(incidents_url) }
      format.xml { head :ok }
    end
  end

  #Exposed for unit testability
  def reindex_params_subforms(params)
    #get all the nested params
    params['incident'].each do |k,v|
      if v.is_a?(Hash) and v.present?
        new_hash = {}
        count = 0
        v.each do |i, value|
          new_hash[count.to_s] = value
          count += 1
        end
        v.replace(new_hash)
      end
    end
  end

  #def exported_properties
    #model_class.properties.reject {|p| p.name == 'violations' }
  #end

  private

  def load_record_or_redirect
    @incident = Incident.get(params[:id])

    if @incident.nil?
      respond_to do |format|
        format.html do
          flash[:error] = "Incident with the given id is not found"
          redirect_to :action => :index and return
        end
      end
    end
  end

  def incident_short_id incident_params
    incident_params[:short_id] || incident_params[:unique_identifier].last(7)
  end

  def create_or_update_incident(incident_params)
    @incident = Incident.by_short_id(:key => incident_short_id(incident_params)).first if incident_params[:unique_identifier]
    if @incident.nil?
      @incident = Incident.new_with_user_name(current_user, incident_params)
    else
      @incident = update_incident_from(params)
    end
  end

  def update_incident_from params
    incident = @incident || Incident.get(params[:id]) || Incident.new_with_user_name(current_user, params[:incident])
    authorize! :update, incident
    reindex_hash params['incident']
    update_incident_with_attachments(incident, params)
  end

  def update_incident_with_attachments(incident, params)
    # new_photo = params[:child].delete("photo")
    # new_photo = (params[:child][:photo] || "") if new_photo.nil?
    # new_audio = params[:child].delete("audio")
    # delete_child_audio = params["delete_child_audio"].present?
    incident.update_properties(params[:incident], current_user_name)
    incident
  end

end
