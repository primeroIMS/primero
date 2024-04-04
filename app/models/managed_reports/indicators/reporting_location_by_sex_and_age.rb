# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total cases by workflow and sex
class ManagedReports::Indicators::ReportingLocationBySexAndAge < ManagedReports::Indicators::FieldByAgeSex
  class << self
    def id
      'reporting_location_by_sex_and_age'
    end

    def field_name
      'location_current'
    end

    def reporting_location_field?
      true
    end
  end
end
