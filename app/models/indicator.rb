class Indicator < ValueObject
  attr_accessor :name, :record_model, :search_filters

  def self.recent_past
    Time.zone.now - 10.days
  end

  def self.present
    Time.zone.now
  end
end
