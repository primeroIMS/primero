class ChildrenController < ApplicationController
  include RecordActions
  include SearchingForRecords  
  
  before_filter :load_record_or_redirect, :only => [ :show, :edit, :destroy, :edit_photo, :update_photo ]  
  before_filter :sanitize_params, :only => [:update, :sync_unverified]
  before_filter :filter_params_array_duplicates, :only => [:create, :update]

  # GET /children
  # GET /children.xml
  def index
    authorize! :index, Child

    @page_name = t("home.view_records")
    @aside = 'shared/sidebar_links'
    @filter = params[:filter] || params[:status] || "all"
    @order = params[:order_by] || 'name'
    per_page = params[:per_page] || ChildrenHelper::View::PER_PAGE
    per_page = per_page.to_i unless per_page == 'all'

    filter_children per_page

    respond_to do |format|
      format.html
      format.xml { render :xml => @children }
      unless params[:format].nil?
        if @children.empty?
          flash[:notice] = t('child.export_error')
          redirect_to :action => :index and return
        end
      end

      respond_to_export format, @children
    end
  end

  # GET /children/1
  # GET /children/1.xml
  def show
    authorize! :read, @child if @child["created_by"] != current_user_name
    @page_name = t "case.view", :short_id => @child.short_id
    @body_class = 'profile-page'
    @duplicates = Child.duplicates_of(params[:id])

    respond_to do |format|
      format.html
      format.xml { render :xml => @child }
      format.json { render :json => @child.compact.to_json }

      respond_to_export format, [ @child ]
    end
  end

  # GET /children/new
  # GET /children/new.xml
  def new
    authorize! :create, Child

    @page_name = t("cases.register_new_case")
    @child = Child.new
    @child.registration_date = DateTime.now.strftime("%d-%b-%Y")
    @child['record_state'] = ["Valid record"]
    @child['child_status'] = ["Open"]
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
    create_or_update_child(params[:child])
    params[:child][:photo] = params[:current_photo_key] unless params[:current_photo_key].nil?
    @child['created_by_full_name'] = current_user_full_name
    @child['child_status'] = "Open" if @child['child_status'].blank?

    respond_to do |format|
      if @child.save
        flash[:notice] = t('child.messages.creation_success')
        format.html { redirect_to(case_path(@child, { follow: true })) }
        format.xml { render :xml => @child, :status => :created, :location => @child }
        format.json {
          render :json => @child.compact.to_json
        }
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
        format.json do

          child = create_or_update_child(params[:child].merge(:verified => current_user.verified?))

          child['created_by_full_name'] = current_user.full_name
          if child.save
            render :json => child.compact.to_json
          end
        end
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
      format.json do
        params[:child] = JSON.parse(params[:child]) if params[:child].is_a?(String)
        child = update_child_from params
        child.save
        render :json => child.compact.to_json
      end

      format.html do
        @child = update_child_from params
        @child['child_status'] = "Open" if @child['child_status'].blank?

        if @child.save
          flash[:notice] = I18n.t("case.messages.update_success")
          return redirect_to "#{params[:redirect_url]}?follow=true" if params[:redirect_url]
          redirect_to case_path(@child, { follow: true })
        else
          @form_sections = get_form_sections

          # TODO: (Bug- https://quoinjira.atlassian.net/browse/PRIMERO-161) This render redirects to the /children url instead of /cases
          render :action => "edit"
        end
      end

      format.xml do
        @child = update_child_from params
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
      @child.set_updated_fields_for current_user_name
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

# DELETE /children/1
# DELETE /children/1.xml
  def destroy
    authorize! :destroy, @child
    @child.destroy

    respond_to do |format|
      format.html { redirect_to(children_url) }
      format.xml { head :ok }
      format.json { render :json => {:response => "ok"}.to_json }
    end
  end

  private

  def child_short_id child_params
    child_params[:short_id] || child_params[:unique_identifier].last(7)
  end

  def create_or_update_child(child_params)
    @child = Child.by_short_id(:key => child_short_id(child_params)).first if child_params[:unique_identifier]
    if @child.nil?
      @child = Child.new_with_user_name(current_user, child_params)
    else
      @child = update_child_from(params)
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
        format.json { render :json => @child.to_json }
        format.html do
          flash[:error] = "Child with the given id is not found"
          redirect_to :action => :index and return
        end
      end
    end
  end

  def filter_children(per_page)
    total_rows, children = children_by_user_access(@filter, per_page)
    @children = paginated_collection children, total_rows
  end

  def children_by_user_access(filter_option, per_page)
    keys = [filter_option]
    params[:scope] ||= {}
    options = {:view_name => "by_#{params[:scope][:record_state] || 'valid_record'}_view_#{params[:order_by] || 'name'}".to_sym}
    unless  can?(:view_all, Child)
      keys = [filter_option, current_user_name]
      options = {:view_name => "by_#{params[:scope][:record_state] || 'valid_record'}_view_with_created_by_#{params[:order_by] || 'created_at'}".to_sym}
    end
    if ['created_at', 'reunited_at', 'flag_at'].include? params[:order_by]
      options.merge!({:descending => true, :startkey => [keys, {}].flatten, :endkey => keys})
    else
      options.merge!({:startkey => keys, :endkey => [keys, {}].flatten})
    end
    Child.fetch_paginated(options, (params[:page] || 1).to_i, per_page)
  end

  def paginated_collection instances, total_rows
    page = params[:page] || 1
    WillPaginate::Collection.create(page, ChildrenHelper::View::PER_PAGE, total_rows) do |pager|
      pager.replace(instances)
    end
  end

  def update_child_from params
    child = @child || Child.get(params[:id]) || Child.new_with_user_name(current_user, params[:child])
    authorize! :update, child

    resolved_params = params.clone
    if params[:child][:revision] != child._rev
      resolved_params[:child] = child.merge_conflicts(params[:child])
    end

    reindex_hash resolved_params['child']
    update_child_with_attachments(child, resolved_params)
  end

  def update_child_with_attachments(child, params)
    child['last_updated_by_full_name'] = current_user_full_name
    new_photo = params[:child].delete("photo")
    new_photo = (params[:child][:photo] || "") if new_photo.nil?
    new_audio = params[:child].delete("audio")
    delete_child_audio = params["delete_child_audio"].present?
    child.update_properties_with_user_name(current_user_name, new_photo, params["delete_child_photo"], new_audio, delete_child_audio, params[:child], params[:delete_child_document])
    child
  end

  def respond_to_export(format, children)
    RapidftrAddon::ExportTask.active.each do |export_task|
      format.any(export_task.id) do
        authorize! "export_#{export_task.id}".to_sym, Child
        LogEntry.create! :type => LogEntry::TYPE[export_task.id], :user_name => current_user.user_name, :organisation => current_user.organisation, :child_ids => children.collect(&:id)
        results = export_task.new.export(children)
        encrypt_exported_files results, export_filename(children, export_task)
      end
    end
  end

  def export_filename(children, export_task)
    (children.length == 1 ? children.first.short_id : current_user_name) + '_' + export_task.id.to_s + '.zip'
  end
  
  def set_class_name
    @className = Child
  end

end
