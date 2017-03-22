class IncidentIdsController < ApplicationController
  @model_class = Incident

  include SyncMobileActions
end