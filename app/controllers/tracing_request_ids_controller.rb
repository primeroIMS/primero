class TracingRequestIdsController < ApplicationController
  @model_class = TracingRequest

  include SyncMobileActions
end