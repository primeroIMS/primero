# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for the Reporting Location configuration
class ReportingLocation < ValueObject
  DEFAULT_FIELD_KEY = 'owned_by_location'
  DEFAULT_ADMIN_LEVEL = 2

  DEFAULT_IR_LOCATION_CONFIG = {
    field_key: 'incident_location'
  }.freeze

  attr_accessor :field_key, :label_keys, :admin_level, :record_list_admin_level, :hierarchy_filter, :admin_level_map

  def initialize(args = {})
    super(args)
    self.admin_level ||= DEFAULT_ADMIN_LEVEL
    self.hierarchy_filter ||= []
    self.admin_level_map ||= { '1' => ['province'], '2' => ['district'] }
    self.label_keys = admin_level_map[admin_level.to_s]
  end

  def levels
    admin_level_map.keys.map(&:to_i)
  end

  def valid_admin_level?
    levels.include?(admin_level)
  end

  def self.default_ir_location_config
    new(DEFAULT_IR_LOCATION_CONFIG)
  end
end
