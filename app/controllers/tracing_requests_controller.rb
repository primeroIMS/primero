class TracingRequestsController < ApplicationController
  @model_class = TracingRequest

  include IndexHelper
  include RecordFilteringPagination
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
      @tracing_request.last_updated_by = current_user.user_name
      @tracing_request.last_updated_organization = current_user.agency
      @tracing_request.save
    end
    redirect_to(@tracing_request)
  end

  def select_primary_photo
    @tracing_request = TracingRequest.find(params[:tracing_request_id])
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
      tracing_request.module_id = params['module_id']
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

  # def update_record_with_attachments(tracing_request)
  #   new_photo = @record_filtered_params.delete("photo")
  #   new_photo = (@record_filtered_params[:photo] || "") if new_photo.nil?
  #   new_audio = @record_filtered_params.delete("audio")
  #   tracing_request.last_updated_by_full_name = current_user.full_name
  #   delete_tracing_request_audio = params["delete_tracing_request_audio"].present?
  #   tracing_request.update_properties_with_user_name(current_user_name, new_photo, params["delete_tracing_request_photo"].to_h, new_audio, delete_tracing_request_audio, @record_filtered_params)
  #   tracing_request
  # end
end
