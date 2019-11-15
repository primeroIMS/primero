module Dashboards
  class Indicator < ValueObject
    attr_accessor :name, :search_filters

    def self.recent_past
      Time.zone.now - 10.days
    end

    def self.present
      Time.zone.now
    end
  end
end