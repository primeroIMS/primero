class ChildMediaController < ApplicationController
  @model_class = Child

  include MediaActions

  helper :children

  private
end
