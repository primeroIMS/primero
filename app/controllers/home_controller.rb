# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Default Rails route
class HomeController < ApplicationController
  skip_before_action :authenticate_user!, only: %w[v2], raise: false

  # TODO: This is temp action for v2 home page
  def v2
    @theme = Rails.configuration.x.use_theme && Theme.current
  end
end
