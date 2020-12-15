# frozen_string_literal: true

# Default Rails route
class HomeController < ApplicationController
  skip_before_action :authenticate_user!, only: %w[v2], raise: false

  # TODO: This is temp action for v2 home page
  def v2; end
end
