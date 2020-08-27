# frozen_string_literal: true

# Controller for Key Performance Indicator Metrics
#
# Making Changes:
#
#   KPIs exist as queries against Solr and Postgres. These queries make use
#   of Sunspot and ActiveRecord respectively. They reside either:
#
#   * in the appropriately named Controller method e.g.
#     Number of Incidents is found at
#     KeyPerformanceIndicatorsController#number_of_incidents
#   * in the associated Concern GBVKeyPerformanceIndicators under the
#     Searches Module.
#
# **This code is currently in flux** as the proper query technolog
# (Solr, Postgres) is yet to be solidified and the proper architecture is yet
# to be defined in totality.
#
class Api::V2::KeyPerformanceIndicatorsController < ApplicationApiController
  include Api::V2::Concerns::GBVKeyPerformanceIndicators

  # This is only temporary to avoid double render errors while developing.
  # I looks like this method wouldn't make sense for the audit log to
  # write given that 'write_audit_log' required a record type, id etc.
  # This response doesn't utilize any type of record yet and so cannot
  # provide this information.
  skip_after_action :write_audit_log

  def number_of_cases
    search = Searches.number_of_cases(from, to)
    @columns = search.columns
    @data = search.data
  end

  def number_of_incidents
    search = Searches.number_of_incidents(from, to)
    @columns = search.columns
    @data = search.data
  end

  def reporting_delay
    @data = Searches.reporting_delay(from, to)
                    .data
  end

  def assessment_status
    search = Searches.assessment_status(from, to)
    @completed_percentage = nan_safe_divide(
      search.facet(:completed_survivor_assessment).rows.count,
      search.total
    )
  end

  def completed_case_safety_plans
    search = Searches.completed_case_safety_plans(from, to)
    @completed_percentage = nan_safe_divide(
      search.facet(:completed_safety_plan).rows.count,
      search.total
    )
  end

  def completed_case_action_plans
    search = Searches.completed_case_action_plans(from, to)
    @completed_percentage = nan_safe_divide(
      search.facet(:completed_action_plan).rows.first&.count || 0,
      search.total
    )
  end

  def completed_supervisor_approved_case_action_plans
    search = Searches.completed_supervisor_approved_case_action_plans(from, to)
    @completed_and_approved_percentage = nan_safe_divide(
      search.facet_response['facet_queries']['completed_and_approved'],
      search.total
    )
  end

  def services_provided
    search = Child.search do
      with :created_at, from..to

      facet :services_provided
    end

    @services = search.facet(:services_provided).rows.map do |row|
      {
        service: Lookup.display_value('lookup-service-type', row.value),
        count: row.count
      }
    end
  end

  def average_referrals
    action_plan_referral_statuses = SolrUtils.indexed_field_name(Child, :action_plan_referral_statuses)
    referred = 'Referred'

    search = Child.search do
      with :created_at, from..to

      adjust_solr_params do |params|
        params[:stats] = true
        params[:'stats.field'] = "{!func}termfreq(#{action_plan_referral_statuses}, #{referred})"
      end
    end

    @average_referrals = search.stats_response.first.last['mean']
  end

  def average_followup_meetings_per_case
    search = Child.search do
      with :status, Record::STATUS_OPEN
      with :created_at, from..to

      stats :number_of_meetings
    end

    @average_meetings = search.stats(:number_of_meetings).mean || 0
  end

  def goal_progress_per_need
    @data = Searches.goal_progress_per_need(from, to)
                    .data
  end

  def time_from_case_open_to_close
    @data = Searches.time_from_case_open_to_close(from, to)
                    .data
  end

  def case_closure_rate
    search = Searches.case_closure_rate(from, to)
    @columns = search.columns
    @data = search.data
  end

  def client_satisfaction_rate
    search = Searches.client_satisfaction_rate(from, to)
    @satisfaction_rate = nan_safe_divide(
      search.facet(:satisfaction_status).rows.first&.count || 0,
      search.total
    )
  end

  def supervisor_to_caseworker_ratio
    ratio = Searches.supervisor_to_caseworker_ratio
    @supervisors = ratio.numerator
    @case_workers = ratio.denominator
  end

  def case_load
    search = Searches.case_load(from, to)
    @data = search.data
  end

  private

  # TODO: Add these to permitted params
  def from
    Sunspot::Type.for_class(Date).to_indexed(params[:from])
  end

  def to
    Sunspot::Type.for_class(Date).to_indexed(params[:to])
  end

  # This handles cases where 0% of something exists as in normal
  # ruby floating point math that is 0 / total which is Float::NaN
  # where we are looking for 0.
  def nan_safe_divide(numerator, denominator)
    return 0 if numerator.zero?

    numerator / denominator.to_f
  end
end
