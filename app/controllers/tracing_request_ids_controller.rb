class TracingRequestIdsController < ApplicationController
  def all
    @user = current_user.managed_user_names
    @tracing_requests = TracingRequest.by_ids_and_revs.select { |f| @user.include? f.owned_by }
    if params["mobile"]
      @tracing_requests = mark_for_mobile(@tracing_requests)
    end
    if params["last_update"]
      @tracing_request = new_update_after_last_update(@tracing_requests, params["last_update"])
    end
    @tracing_requests = show_ids_and_revs(@tracing_requests)
    render :json => @tracing_requests
  end

  def new_update_after_last_update(tracing_requests, last_update)
    tracing_requests = tracing_requests.select { |f| f.last_updated_at > last_update }
    tracing_requests
  end

  def mark_for_mobile(tracing_requests)
    tracing_requests = tracing_requests.select { |f| f.marked_for_mobile? }
    tracing_requests
  end

  def show_ids_and_revs(tracing_requests)
    tracing_requests = tracing_requests.map do |tracing_request|
      tracing_request_ids_and_revs = Hash.new
      tracing_request_ids_and_revs["_id"], tracing_request_ids_and_revs["_rev"] = tracing_request._id, tracing_request._rev
      tracing_request_ids_and_revs
    end
    tracing_requests
  end

end