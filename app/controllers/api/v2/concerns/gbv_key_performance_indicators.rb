# frozen_string_literal: true

module Api::V2::Concerns
  # GBVKeyPerformanceIndicators captures all of the GBV KPI searches and
  # associated logic
  module GBVKeyPerformanceIndicators
    extend ActiveSupport::Concern

    SUPERVISOR_ROLES = [
      'role-gbv-case-management-supervisor'
    ].freeze

    CASE_WORKER_ROLES = [
      'role-gbv-mobile-caseworker',
      'role-gbv-caseworker'
    ].freeze

    # Searches houses the public interface for running the queries for
    # calulcating the KPIs
    module Searches

      # PivotedRangeSearch
      #
      # Extract the logic for a common form of search involving a range,
      # usually of dates and a pivoted field for counting occurances within
      # those dates.
      class PivotedRangeSearch < KPI::Search
        class <<self
          def range_field(field = nil)
            @range_field ||= field
          end

          def pivot_field(field = nil)
            @pivot_field ||= field
          end
        end

        def range_field
          SolrUtils.sunspot_setup(search_model).field(self.class.range_field)
        end

        def pivot_field
          SolrUtils.sunspot_setup(search_model).field(self.class.pivot_field)
        end

        # Shortening this method (or the others below) would either:
        #
        # 1. Require an arbitrary breaking up of the solr query into methods
        #    which arguably add little to no explanatory or architectural value
        #    to the code base.
        # 2. Require re-achitecting the solution to invert the responcibilities
        #    of defining a search so that individual aspects of the search
        #    would be defined in methods and later combined together into a
        #    whole search by some evaluation method. It feels wrong to drive
        #    that sort of architectural decisions for linting reasons alone.
        #
        # rubocop:disable Metrics/MethodLength
        def search
          @search ||= search_model.search do
            adjust_solr_params do |params|
              params.merge!(
                'facet': true,
                'facet.range': "{!tag=range}#{range_field.indexed_name}",
                'facet.range.start': from,
                'facet.range.end': to,
                'facet.range.gap': '+1MONTH',
                'facet.pivot': [
                  "{!range=range}#{pivot_field.indexed_name}"
                ]
              )
            end

            paginate page: 1, per_page: 0
          end
        end
        # rubocop:enable Metrics/MethodLength

        def columns
          @columns ||= search.facet_response
                             .dig('facet_ranges', range_field.indexed_name, 'counts')
                             .each_cons(2)
                             .map(&:first)
        end

        def data
          @data ||= pivot_range_counts.map do |value, counts|
            placename = Location.find_by(location_code: value.upcase)
                                .placename

            { reporting_site: placename }.merge(counts)
          end
        end

        private

        def pivot_range_counts
          search.facet_response
                .dig('facet_pivot', pivot_field.indexed_name)
                .map do |record|
            [record['value'],
             record
               .dig('ranges', range_field.indexed_name, 'counts')
               .each_cons(2)
               .to_h]
          end.to_h
        end
      end

      # BucketedSearch
      #
      # Extracts the logic for a common form of search in which data is
      # aggregated into buckets over a range of data.
      class BucketedSearch < KPI::Search
        class <<self
          def restricted_field(field = nil)
            @restricted_field ||= field
          end

          def compared_field(field = nil)
            @compared_field ||= field
          end
        end

        def restricted_field
          SolrUtils.sunspot_setup(search_model).field(self.class.restricted_field)
        end

        def compared_field
          SolrUtils.sunspot_setup(search_model).field(self.class.compared_field)
        end

        def days(number)
          number * 24 * 60 * 60 * 1000
        end

        # For the purposes of this search 1 month is 30.4167 days or
        # 30.4167 * 24 * 60 * 60 * 1000 milliseconds
        def months(number)
          number * 30.4167 * 24 * 60 * 60 * 1000
        end

        def buckets
          raise NotImplementedError
        end

        # rubocop:disable Metrics/AbcSize
        def search
          @search ||= search_model.search do
            with restricted_field.name, from..to
            without :duplicate, true

            adjust_solr_params do |params|
              params[:facet] = true
              params[:'facet.query'] = buckets.map do |args|
                frange(restricted_field.indexed_name, compared_field.indexed_name, args)
              end
            end
          end
        end
        # rubocop:enable Metrics/AbcSize

        def data
          raise NotImplementedError
        end

        private

        def frange(field_a, field_b, **options)
          param_string = options.map { |k, v| "#{k}=#{v}" }.join(' ')
          "{!frange #{param_string}} ms(#{field_a},#{field_b})"
        end
      end

      # NumberOfCases Search
      #
      # Looks for all of the cases created in a given location over a range
      # of months.
      class NumberOfCases < PivotedRangeSearch
        search_model Child
        range_field :created_at
        pivot_field :owned_by_location
      end

      # NumberOfIncidents Search
      #
      # Looks for the number of incidents reported in a given location over
      # a range of months.
      class NumberOfIncidents < PivotedRangeSearch
        search_model Incident
        range_field :created_at
        pivot_field :owned_by_location
      end

      # ReportingDelay Search
      #
      # For incidents created in a given range of moneths, looks at the
      # difference between when an incident was first reported and when
      # the incident actually happened. This is aggregated into 6 time ranges.
      class ReportingDelay < BucketedSearch
        search_model Incident
        restricted_field :date_of_first_report
        compared_field :incident_date_derived

        def buckets
          [
            { key: '0-3days', u: days(3) },
            { key: '4-5days', l: days(3) + 1, u: days(5) },
            { key: '6-14days', l: days(5) + 1, u: days(14) },
            { key: '15-30days', l: days(14) + 1, u: days(30) },
            { key: '1-3months', l: days(30) + 1, u: months(3) },
            { key: '4months', l: months(3) + 1 }
          ]
        end

        def data
          @data = search.facet_response['facet_queries'].map do |delay, number_of_incidents|
            {
              delay: delay,
              total_incidents: number_of_incidents,
              percentage: number_of_incidents.to_f / search.total
            }
          end
        end
      end

      # CompletedSupervisorApprovedCaseActionPlans Search
      #
      # For cases created within a given range of months, looks at how many
      # cases have their action plan completed. Completion is defined in
      # app/models/concerns/gbv_key_performance_indicators.rb.
      class CompletedSupervisorApprovedCaseActionPlans < KPI::Search
        def completed_action_plan
          @completed_action_plan ||= SolrUtils.indexed_field_name(Child, :completed_action_plan)
        end

        def case_plan_approved
          @case_plan_approved ||= SolrUtils.indexed_field_name(Child, :case_plan_approved)
        end

        def search
          Child.search do
            with :status, Record::STATUS_OPEN
            with :created_at, from..to

            # This seems like an obtuse way to use an in a facet query
            adjust_solr_params do |params|
              params[:facet] = true
              params[:'facet.query'] =
                "{! key=completed_and_approved } #{completed_action_plan}:true AND #{case_plan_approved}:true"
            end
          end
        end
      end

      # GoalProgressPerNeed Search
      #
      # For cases created within a given range of months, looks at how much
      # progress has been made towards meeting the needs (or goals) of a
      # survivor. How a need / goal is defined and how to calculate it's
      # complection is defined in:
      # app/models/concerns/gbv_key_performance_indicators.rb
      class GoalProgressPerNeed < KPI::Search
        def search
          @search ||= Child.search do
            with :status, Record::STATUS_OPEN
            with :created_at, from..to

            stats :safety_goals_progress,
                  :health_goals_progress,
                  :psychosocial_goals_progress,
                  :justice_goals_progress,
                  :other_goals_progress
          end
        end

        def data
          [
            create_goal_progress('safety', :safety_goals_progress),
            create_goal_progress('health', :health_goals_progress),
            create_goal_progress('psychosocial', :psychosocial_goals_progress),
            create_goal_progress('justice', :justice_goals_progress),
            create_goal_progress('other', :other_goals_progress)
          ]
        end

        private

        def create_goal_progress(label, stat_key)
          {
            need: I18n.t("key_performance_indicators.goal_progress_per_need.#{label}"),
            percentage: handle_solr_stats_value(search.stats(stat_key).mean)
          }
        end

        def handle_solr_stats_value(value)
          if value == 'NaN' || value.nil?
            0.0
          else
            value
          end
        end
      end

      # TimeFromCaseOpenToClose Search
      #
      # For cases created between a given range of months, looks at the
      # difference in time between when a case was created and when it was
      # closed. This is aggregated into 4 bins.
      class TimeFromCaseOpenToClose < BucketedSearch
        search_model Child
        restricted_field :date_closure
        compared_field :created_at

        def buckets
          [
            { key: '1-month', u: months(1) },
            { key: '1-3months', l: months(1) + 1, u: months(3) },
            { key: '3-6months', l: months(3) + 1, u: months(6) },
            { key: '7-months', l: months(6) + 1 }
          ]
        end

        def data
          @data ||= search.facet_response['facet_queries']
                          .map do |delay, total_cases|
            {
              time: delay,
              percent: total_cases.to_f / search.total
            }
          end
        end
      end

      # CaseClosureRate Search
      #
      # Looks at how many cases were closed in a given range of months for
      # each location in which a case was closed within that range of months.
      class CaseClosureRate < PivotedRangeSearch
        search_model Child
        pivot_field :owned_by_location
        range_field :date_closure
      end

      # CaseLoad Search
      #
      # For cases created in a given range of months, looks at how many cases
      # each 'owner' (a User) has. This is aggregated into 4 bins for analysis.
      class CaseLoad < KPI::Search
        def search
          @search ||= Child.search do
            with :created_at, from..to

            facet :owned_by
          end
        end

        def data
          @data ||= [
            create_case_load(owners, '10cases', 0..10),
            create_case_load(owners, '20cases', 0..20),
            create_case_load(owners, '21-30cases', 21..30),
            create_case_load(owners, '30cases', 31..Float::INFINITY)
          ]
        end

        private

        def owners
          @owners ||= search.facet(:owned_by).rows
        end

        def create_case_load(owners, key, range)
          {
            case_load: key,
            percent: nan_safe_divide(
              owners.select { |owner| range.include?(owner.count) }.count,
              owners.count
            )
          }
        end

        # This handles cases where 0% of something exists as in normal
        # ruby floating point math that is 0 / total which is Float::NaN
        # where we are looking for 0.
        def nan_safe_divide(numerator, denominator)
          return 0 if numerator.zero?

          numerator / denominator.to_f
        end
      end

      class << self
        def number_of_cases(from, to)
          NumberOfCases.new(from, to)
        end

        def number_of_incidents(from, to)
          NumberOfIncidents.new(from, to)
        end

        def reporting_delay(from, to)
          ReportingDelay.new(from, to)
        end

        def assessment_status(from, to)
          Child.search do
            with :status, Record::STATUS_OPEN
            with :created_at, from..to

            facet :completed_survivor_assessment, only: true
          end
        end

        def completed_case_safety_plans(from, to)
          Child.search do
            with :status, Record::STATUS_OPEN
            with :created_at, from..to
            with :safety_plan_required, true

            facet :completed_safety_plan, only: true
          end
        end

        def completed_case_action_plans(from, to)
          Child.search do
            with :status, Record::STATUS_OPEN
            with :created_at, from..to

            facet :completed_action_plan, only: true
          end
        end

        def completed_supervisor_approved_case_action_plans(from, to)
          CompletedSupervisorApprovedCaseActionPlans.new(from, to).search
        end

        def goal_progress_per_need(from, to)
          GoalProgressPerNeed.new(from, to)
        end

        def time_from_case_open_to_close(from, to)
          TimeFromCaseOpenToClose.new(from, to)
        end

        def case_closure_rate(from, to)
          CaseClosureRate.new(from, to)
        end

        def client_satisfaction_rate(from, to)
          Child.search do
            with :created_at, from..to

            any_of do
              with :satisfaction_status, 'satisfied'
              with :satisfaction_status, 'unsatisfied'
            end

            facet :satisfaction_status, only: 'satisfied'
          end
        end

        def supervisor_to_caseworker_ratio
          supervisors = User.joins(:role)
                            .where(roles: { unique_id: SUPERVISOR_ROLES }).count
          case_workers = User.joins(:role)
                             .where(roles: { unique_id: CASE_WORKER_ROLES }).count
          (supervisors / case_workers).rationalize
        end

        def case_load(from, to)
          CaseLoad.new(from, to)
        end
      end
    end
  end
end
