# frozen_string_literal: true

module Api::V2::Concerns
  # GBVKeyPerformanceIndicators captures all of the GBV KPI searches and
  # associated logic
  module GBVKeyPerformanceIndicators
    extend ActiveSupport::Concern

    # Searches houses the public interface for running the queries for
    # calulcating the KPIs
    module Searches
      class << self
        def number_of_cases(from, to)
          KPI::NumberOfCases.new(from, to)
        end

        def number_of_incidents(from, to)
          KPI::NumberOfIncidents.new(from, to)
        end

        def reporting_delay(from, to)
          KPI::ReportingDelay.new(from, to)
        end

        def assessment_status(from, to)
          KPI::AssessmentStatus.new(from, to).search
        end

        def completed_case_safety_plans(from, to)
          KPI::CompletedCaseSafetyPlans.new(from, to).search
        end

        def completed_case_action_plans(from, to)
          KPI::CompletedCaseActionPlans.new(from, to).search
        end

        def completed_supervisor_approved_case_action_plans(from, to)
          KPI::CompletedSupervisorApprovedCaseActionPlans.new(from, to).search
        end

        def goal_progress_per_need(from, to)
          KPI::GoalProgressPerNeed.new(from, to)
        end

        def time_from_case_open_to_close(from, to)
          KPI::TimeFromCaseOpenToClose.new(from, to)
        end

        def case_closure_rate(from, to)
          KPI::CaseClosureRate.new(from, to)
        end

        def client_satisfaction_rate(from, to)
          KPI::ClientSatisfactionRate.new(from, to).search
        end

        def supervisor_to_caseworker_ratio
          KPI::SupervisorToCaseworkerRatio.new.ratio
        end

        def case_load(from, to)
          KPI::CaseLoad.new(from, to)
        end
      end
    end
  end
end
