# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A shared concern to initialize LocationService
module LocationCacheable
  extend ActiveSupport::Concern

  attr_writer :location_service

  def location_service
    @location_service ||= LocationService.instance
  end
end
