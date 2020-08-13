class ReportingLocation < ValueObject

  DEFAULT_FIELD_KEY = 'owned_by_location'
  DEFAULT_LABEL_KEY = 'district'
  DEFAULT_ADMIN_LEVEL = 2

  attr_accessor :field_key, :label_key, :admin_level, :hierarchy_filter, :admin_level_map

  def initialize(args={})
    super(args)
    self.admin_level ||= 0
    self.hierarchy_filter ||= []
    self.admin_level_map ||= {'country' => 0, 'province' => 1, 'district' => 2}
  end

  class << self
    def reporting_location_levels
      Lookup.values('lookup-reporting-location-type').map{|l| l['id']}
    end
  end

  def default_label_key
    if self.label_key.blank?
      self.label_key = ReportingLocation::DEFAULT_LABEL_KEY
    end
  end

  def is_valid_admin_level?
    Location::ADMIN_LEVELS.include?(self.admin_level) ? true : false
  end

  def map_reporting_location_level_to_admin_level(reporting_location_level)
    return nil if reporting_location_level.blank?

    admin_level_map[reporting_location_level]
  end

end
