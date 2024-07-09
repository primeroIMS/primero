# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Default Rails route
class HomeController < ApplicationController
  def v2
    @theme = Rails.configuration.use_theme ? Theme.current : Theme.default
  end
end
