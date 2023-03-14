# frozen_string_literal: true

# A shared concern to initialize LocationService
module LocationCacheable
  extend ActiveSupport::Concern

  attr_writer :location_service

  def location_service
    @location_service ||= LocationService.instance
  end
end
