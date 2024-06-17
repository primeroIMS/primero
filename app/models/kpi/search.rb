# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

module Kpi
  SearchValue = Struct.new(:from, :to, :owned_by_groups, :owned_by_agency_id)
  VALID_KPIS = ['Kpi::AssessmentStatus',
                'Kpi::AverageFollowupMeetingsPerCase',
                'Kpi::AverageReferrals',
                'Kpi::CaseClosureRate',
                'Kpi::CaseLoad',
                'Kpi::ClientSatisfactionRate',
                'Kpi::CompletedCaseActionPlans',
                'Kpi::CompletedCaseSafetyPlans',
                'Kpi::CompletedSupervisorApprovedCaseActionPlans',
                'Kpi::GoalProgressPerNeed',
                'Kpi::NumberOfCases',
                'Kpi::NumberOfIncidents',
                'Kpi::ReportingDelay',
                'Kpi::ServicesProvided',
                'Kpi::SupervisorToCaseworkerRatio',
                'Kpi::TimeFromCaseOpenToClose'].freeze

  # Search
  #
  # An abstract class for search objects to subclass.
  class Search < SearchValue
    def self.find(id)
      name = "Kpi::#{id.camelize}"
      return unless VALID_KPIS.include?(name)

      Object.const_get(name)
    rescue NameError
      nil
    end

    def self.search_model(model = nil)
      @search_model ||= model
    end

    def search_model
      self.class.search_model
    end

    def to_json(*_args)
      raise NotImplementedError
    end

    private

    # This handles cases where 0% of something exists as in normal
    # ruby floating point math that is 0 / total which is Float::NaN
    # where we are looking for 0.
    def nan_safe_divide(numerator, denominator)
      return 0 if numerator.zero?

      numerator / denominator.to_f
    end
  end
end
