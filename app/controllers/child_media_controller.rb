class ChildMediaController < ApplicationController
  include MediaActions

  helper :children

  private

  def set_class_name
    @className = Child
  end
end
