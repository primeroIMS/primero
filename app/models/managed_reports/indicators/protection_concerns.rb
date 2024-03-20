# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total cases by protection_concerns and sex
class ManagedReports::Indicators::ProtectionConcerns < ManagedReports::Indicators::FieldByAgeSex
  class << self
    def id
      'protection_concerns'
    end

    def field_name
      'protection_concerns'
    end

    def field_query_method
      equal_value_query_multiple
    end
  end
end
