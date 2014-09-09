class ChildMediaController < ApplicationController
  include MediaActions

  helper :children

  private

  def set_class_name
    model_class = Child
  end
end
