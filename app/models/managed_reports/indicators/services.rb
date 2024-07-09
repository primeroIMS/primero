# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total cases by protection_concerns and sex
class ManagedReports::Indicators::Services < ManagedReports::Indicators::SubformFieldByAgeSex
  class << self
    def id
      'services'
    end

    def field_name
      'service_type'
    end

    def subform_section
      'services_section'
    end

    def date_filter_nested?
      true
    end

    def multiple_field_values
      true
    end
  end
end
