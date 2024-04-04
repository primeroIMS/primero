# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total cases by protection_concerns and sex
class ManagedReports::Indicators::Followups < ManagedReports::Indicators::SubformFieldByAgeSex
  class << self
    def id
      'followups'
    end

    def field_name
      'followup_type'
    end

    def subform_section
      'followup_subform_section'
    end

    def multiple_field_values
      true
    end
  end
end
