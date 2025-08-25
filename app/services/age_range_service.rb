# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A service that returns age ranges
class AgeRangeService
  def self.primary_age_ranges(module_unique_id = nil)
    return SystemSettings.primary_age_ranges unless module_unique_id.present?

    module_age_ranges = PrimeroModule.find_by(unique_id: module_unique_id)&.generate_age_ranges
    return module_age_ranges if module_age_ranges.present?

    SystemSettings.primary_age_ranges
  end
end
