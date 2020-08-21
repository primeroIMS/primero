# frozen_string_literal: true

# Model for the Reporting Location configuration
class ReportingLocation < ValueObject
  DEFAULT_FIELD_KEY = 'owned_by_location'
  DEFAULT_ADMIN_LEVEL = 2

  attr_accessor :field_key, :admin_level, :hierarchy_filter, :admin_level_map

  def initialize(args = {})
    super(args)
    self.admin_level ||= DEFAULT_ADMIN_LEVEL
    self.hierarchy_filter ||= []
    self.admin_level_map ||= { '0' => 'country', '1' => 'province', '2' => 'district' }
  end

  def levels
    admin_level_map.keys.map(&:to_i)
  end

  def label_key
    admin_level_map[admin_level.to_s]
  end

  def valid_admin_level?
    levels.include?(admin_level) ? true : false
  end
end
