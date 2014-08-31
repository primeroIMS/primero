class IncidentsController < ApplicationController
  include RecordFilteringPagination

  before_filter :load_record_or_redirect, :only => [ :show, :edit, :destroy ]

  include RecordActions

  def index
    authorize! :index, Incident

    @page_name = t("home.view_records")
    @aside = 'shared/sidebar_links'

    search = Incident.list_records filter, order, pagination, associated_users
    @incidents = search.results
    @total_records = search.total
    @per_page = per_page

    # TODO: Ask Pavel about highlighted fields. This is slowing everything down. May need some caching or lower page limit
    # index average 400ms to 600ms without and 1000ms to 3000ms with.
    @highlighted_fields = FormSection.sorted_highlighted_fields

    respond_to do |format|
      format.html
      format.xml { render :xml => @incidents }
      unless params[:format].nil?
        if @incidents.empty?
          flash[:notice] = t('incident.export_error')
          redirect_to :action => :index and return
        end
      end

      respond_to_export format, @incidents
    end
  end


  def show
    authorize! :read, @incident if @incident["created_by"] != current_user_name
    @page_name = t "incident.view", :short_id => @incident.short_id
    @body_class = 'profile-page'
    @duplicates = Incident.duplicates_of(params[:id])

    respond_to do |format|
      format.html
      format.xml { render :xml => @incident }
      format.json { render :json => @incident.compact.to_json }

      respond_to_export format, [ @incident ]
    end
  end

  def new
    authorize! :create, Incident

    @page_name = t("incidents.register_new_incident")
    @incident = Incident.new
    @incident['status'] = ["Active"]
    @incident['record_state'] = ["Valid record"]
    @incident['mrm_verification_status'] = "Pending"
    @incident['module_id'] = params['module_id']

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

    respond_to do |format|
      if @incident.save
        flash[:notice] = t('incident.messages.creation_success')
        format.html { redirect_to(incident_path(@incident, { follow: true })) }
        #format.xml { render :xml => @incident, :status => :created, :location => @child }
        format.json {
          render :json => @incident.compact.to_json
        }
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
    params['incident']['violations'].compact if params['incident'].present? && params['incident']['violations'].present?

    respond_to do |format|
      format.json do
        params[:incident] = JSON.parse(params[:incident]) if params[:incident].is_a?(String)
        incident = update_incident_from params
        incident.save
        render :json => incident.compact.to_json
      end

      format.html do
        @incident = update_incident_from params
        if @incident.save
          flash[:notice] = I18n.t("incident.messages.update_success")
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
      format.json { render :json => {:response => "ok"}.to_json }
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

  private

  def load_record_or_redirect
    @incident = Incident.get(params[:id])

    if @incident.nil?
      respond_to do |format|
        format.json { render :json => @incident.to_json }
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



  def respond_to_export(format, records)
    RapidftrAddon::ExportTask.active.each do |export_task|
      format.any(export_task.id) do
        #authorize! "export_#{export_task.id}".to_sym, Child
        #LogEntry.create! :type => LogEntry::TYPE[export_task.id], :user_name => current_user.user_name, :organisation => current_user.organisation, :child_ids => children.collect(&:id)
        #results = export_task.new.export(children)
        #encrypt_exported_files results, export_filename(children, export_task)
      end
    end
  end

  def set_class_name
    @className = Incident
  end

end
