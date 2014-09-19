class TracingRequestsController < ApplicationController
  @model_class = TracingRequest

  include RecordFilteringPagination

  before_filter :load_record_or_redirect, :only => [ :show, :edit, :destroy, :edit_photo, :update_photo ]
  before_filter :sanitize_params, :only => [:update]
  #TODO: Dp we need to filter_params_array_duplicates?

  include RecordActions

  def index
    authorize! :index, TracingRequest

    @page_name = t("home.view_records")
    @aside = 'shared/sidebar_links'

    @associated_users = current_user.managed_user_names
    search = TracingRequest.list_records filter, order, pagination, users_filter, params[:query]
    @tracing_requests = search.results
    @total_records = search.total
    @per_page = per_page

    respond_to do |format|
      format.html
      format.xml { render :xml => @tracing_requests }

      unless params[:format].nil?
        if @tracing_requests.empty?
          flash[:notice] = t('exports.no_records')
          redirect_to :action => :index and return
        end
      end

      respond_to_export format, @tracing_requests
    end
  end


  def show
    authorize! :read, @tracing_request
    @page_name = t "tracing_request.view", :short_id => @tracing_request.short_id
    @body_class = 'profile-page'
    #TODO: Are duplicated implemented for TracingRequests? CARLOS!?!
    @duplicates = TracingRequest.duplicates_of(params[:id])

    @flag_count = @tracing_request.flags.select{|f| !f.removed}.count

    respond_to do |format|
      format.html
      format.xml { render :xml => @tracing_request }
      format.json { render :json => @tracing_request.compact.to_json }

      respond_to_export format, [ @tracing_request ]
    end
  end

  def new
    authorize! :create, TracingRequest

    @page_name = t("tracing_request.register_new_tracing_request")
    @tracing_request = TracingRequest.new
    @tracing_request['inquiry_date'] = DateTime.now.strftime("%d-%b-%Y")
    @tracing_request['status'] = ["Active"]
    @tracing_request['record_state'] = ["Valid record"]
    @tracing_request['inquiry_status'] = ["Open"]
    @tracing_request['mrm_verification_status'] = "Pending"
    @tracing_request['module_id'] = params['module_id']

    get_form_sections

    respond_to do |format|
      format.html
      format.xml { render :xml => @tracing_request }
    end
  end

  def edit
    authorize! :update, @tracing_request

    @page_name = t("tracing_request.edit")

    @flag_count = @tracing_request.flags.select{|f| !f.removed}.count
  end

  def create
    authorize! :create, TracingRequest
    params[:tracing_request] = JSON.parse(params[:tracing_request]) if params[:tracing_request].is_a?(String)
    reindex_hash params['tracing_request']
    create_or_update_tracing_request(params[:tracing_request])
    params[:tracing_request][:photo] = params[:current_photo_key] unless params[:current_photo_key].nil?

    respond_to do |format|
      if @tracing_request.save
        flash[:notice] = t('tracing_request.messages.creation_success')
        format.html { redirect_to(tracing_request_path(@tracing_request, { follow: true })) }
        format.json {
          render :json => @tracing_request.compact.to_json
        }
      else
        format.html {
          @form_sections = get_form_sections

          render :action => "new"
        }
        format.xml { render :xml => @tracing_request.errors, :status => :unprocessable_entity }
      end
    end
  end

  #TODO verify if needs some refactoring after Ben's changes get merged in the main branch.
  def update
    respond_to do |format|
      format.json do
        params[:tracing_request] = JSON.parse(params[:tracing_request]) if params[:tracing_request].is_a?(String)
        tracing_request = update_tracing_request_from params
        tracing_request.save
        render :json => tracing_request.compact.to_json
      end

      format.html do
        @tracing_request = update_tracing_request_from params
        if @tracing_request.save
          flash[:notice] = I18n.t("tracing_request.messages.update_success")
          return redirect_to "#{params[:redirect_url]}?follow=true" if params[:redirect_url]
          redirect_to tracing_request_path(@tracing_request, { follow: true })
        else
          @form_sections = get_form_sections

          render :action => "edit"
        end
      end

      format.xml do
        @tracing_request = update_tracing_request_from params
        if @tracing_request.save
          head :ok
        else
          render :xml => @tracing_request.errors, :status => :unprocessable_entity
        end
      end
    end
  end

  def edit_photo
    authorize! :update, @tracing_request
    @page_name = t("tracing_request.edit_photo")
  end

  def update_photo
    authorize! :update, @tracing_request
    orientation = params[:tracing_request].delete(:photo_orientation).to_i
    if orientation != 0
      @tracing_request.rotate_photo(orientation)
      @tracing_request.set_updated_fields_for current_user_name
      @tracing_request.save
    end
    redirect_to(@tracing_request)
  end

  def select_primary_photo
    @tracing_request = TracingRequest.get(params[:tracing_request_id])
    authorize! :update, @tracing_request
    begin
      @tracing_request.primary_photo_id = params[:photo_id]
      @tracing_request.save
      head :ok
    rescue
      head :error
    end
  end

  def destroy
    authorize! :destroy, @tracing_request
    @tracing_request.destroy

    respond_to do |format|
      format.html { redirect_to(tracing_requests_url) }
      format.xml { head :ok }
      format.json { render :json => {:response => "ok"}.to_json }
    end
  end


  private

  def sanitize_params
    tracing_request = params['tracing_request']
    tracing_request['histories'] = JSON.parse(tracing_request['histories']) if tracing_request and tracing_request['histories'].is_a?(String) #histories might come as string from the mobile client.
  end

  def load_record_or_redirect
    @tracing_request = TracingRequest.get(params[:id])

    if @tracing_request.nil?
      respond_to do |format|
        format.json { render :json => @tracing_request.to_json }
        format.html do
          flash[:error] = "Tracing request with the given id is not found"
          redirect_to :action => :index and return
        end
      end
    end
  end

  def filter_tracing_requests(per_page)
    total_rows, tracing_requests = tracing_requests_by_user_access(@filter, per_page)
    @tracing_requests = paginated_collection tracing_requests, total_rows
  end

  def tracing_requests_by_user_access(filter_option, per_page)
    keys = [filter_option]
    params[:scope] ||= {}
    options = {:view_name => "by_#{params[:scope][:record_state] || 'valid_record'}_view_#{params[:order_by] || 'enquirer_name'}".to_sym}
    unless  can?(:view_all, TracingRequest)
      keys = [filter_option, current_user_name]
      options = {:view_name => "by_#{params[:scope][:record_state] || 'valid_record'}_view_with_created_by_#{params[:order_by] || 'created_at'}".to_sym}
    end
    if ['created_at'].include? params[:order_by]
      options.merge!({:descending => true, :startkey => [keys, {}].flatten, :endkey => keys})
    else
      options.merge!({:startkey => keys, :endkey => [keys, {}].flatten})
    end
    TracingRequest.fetch_paginated(options, (params[:page] || 1).to_i, per_page)
  end

  def paginated_collection instances, total_rows
    page = params[:page] || 1
    WillPaginate::Collection.create(page, TracingRequestsHelper::View::PER_PAGE, total_rows) do |pager|
      pager.replace(instances)
    end
  end

  def tracing_request_short_id tracing_request_params
    tracing_request_params[:short_id] || tracing_request_params[:unique_identifier].last(7)
  end

  def create_or_update_tracing_request(tracing_request_params)
    @tracing_request = TracingRequest.by_short_id(:key => tracing_request_short_id(tracing_request_params)).first if tracing_request_params[:unique_identifier]
    if @tracing_request.nil?
      @tracing_request = TracingRequest.new_with_user_name(current_user, tracing_request_params)
    else
      @tracing_request = update_tracing_request_from(params)
    end
  end

  def update_tracing_request_from params
    tracing_request = @tracing_request || TracingRequest.get(params[:id]) || TracingRequest.new_with_user_name(current_user, params[:tracing_request])
    authorize! :update, tracing_request

    resolved_params = params.clone
    if params[:tracing_request][:revision] != tracing_request._rev
      resolved_params[:tracing_request] = tracing_request.merge_conflicts(params[:tracing_request])
    end

    reindex_hash resolved_params['tracing_request']
    update_tracing_request_with_attachments(tracing_request, resolved_params)
  end

  def update_tracing_request_with_attachments(tracing_request, params)
    new_photo = params[:tracing_request].delete("photo")
    new_photo = (params[:tracing_request][:photo] || "") if new_photo.nil?
    new_audio = params[:tracing_request].delete("audio")
    tracing_request.last_updated_by_full_name = current_user_full_name
    delete_tracing_request_audio = params["delete_tracing_request_audio"].present?
    tracing_request.update_properties_with_user_name(current_user_name, new_photo, params["delete_tracing_request_photo"], new_audio, delete_tracing_request_audio, params[:tracing_request], params[:delete_tracing_request_document])
    tracing_request
  end

end
