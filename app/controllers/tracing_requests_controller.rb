class TracingRequestsController < ApplicationController
  @model_class = TracingRequest

  include IndexHelper
  include RecordFilteringPagination

  #TODO: Do we need to filter_params_array_duplicates?

  include RecordActions

  def edit_photo
    authorize! :update, @tracing_request
    @page_name = t("tracing_request.edit_photo")
  end

  def update_photo
    authorize! :update, @tracing_request
    orientation = params[:tracing_request].delete(:photo_orientation).to_i
    if orientation != 0
      @tracing_request.rotate_photo(orientation)
      @tracing_request.last_updated_by = current_user_name
      @tracing_request.last_updated_organization = current_user_agency
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

  private

  # A hack due to photos being submitted under an adhoc key
  def extra_permitted_parameters
    super + ['photo', 'audio']
  end

  def make_new_record
    TracingRequest.new.tap do |tracing_request|
      tracing_request['module_id'] = params['module_id']
    end
  end

  def redirect_after_update
    redirect_to tracing_request_path(@tracing_request, { follow: true })
  end

  def redirect_after_deletion
    redirect_to(tracing_requests_url)
  end

  def redirect_to_list
    redirect_to tracing_requests_path(scope: {:inquiry_status => "list||#{Record::STATUS_OPEN}", :record_state => "list||true"})
  end

  def record_filter(filter)
    filter["record_state"] ||= {:type => "single", :value => true}
    filter
  end

  #TODO: Is this code used anywhere? Aren't tracing requests just indexed?
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

  def update_record_with_attachments(tracing_request)
    new_photo = @record_filtered_params.delete("photo")
    new_photo = (@record_filtered_params[:photo] || "") if new_photo.nil?
    new_audio = @record_filtered_params.delete("audio")
    tracing_request.last_updated_by_full_name = current_user_full_name
    delete_tracing_request_audio = params["delete_tracing_request_audio"].present?
    tracing_request.update_properties_with_user_name(current_user_name, new_photo, params["delete_tracing_request_photo"].to_h, new_audio, delete_tracing_request_audio, @record_filtered_params)
    tracing_request
  end
end
