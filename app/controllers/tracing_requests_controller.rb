class TracingRequestsController < ApplicationController
  @model_class = TracingRequest

  include RecordFilteringPagination
  include RecordActions

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
    redirect_to tracing_requests_path(scope: {:status => "list||#{Record::STATUS_OPEN}", :record_state => "list||true"})
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
