class ChildIdsController < ApplicationController
  @model_class = Child

  include SyncMobileActions
end