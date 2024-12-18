# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Default Rails route
class HomeController < ApplicationController
  def v2
    @theme = Theme.current
  end
end
