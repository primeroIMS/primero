# frozen_string_literal: true

# This represents the elements that are to be displayed on the Dashboard
# rubocop:disable Metrics/ClassLength
class Dashboard < ValueObject
  attr_accessor :name, :type, :indicators

  def name_i18n_key
    "dashboard.#{name}"
  end

  DYNAMIC = %w[
    dash_protection_concerns
    cases_by_task_overdue_assessment
    cases_by_task_overdue_case_plan
    cases_by_task_overdue_services
    cases_by_task_overdue_followups
    dash_cases_to_assign
    dash_national_admin_summary
  ].freeze

  # Note: The constant name of each Dashboard needs to match the value of the corresponding Permission

  CASE_OVERVIEW = Dashboard.new(
    name: 'case_overview',
    type: 'indicator',
    indicators: [
      Indicators::Case::OPEN, Indicators::Case::UPDATED
    ]
  ).freeze

  WORKFLOW = Dashboard.new(
    name: 'workflow',
    type: 'indicator',
    indicators: [Indicators::Case::WORKFLOW]
  ).freeze

  WORKFLOW_TEAM = Dashboard.new(
    name: 'workflow_team',
    type: 'indicator',
    indicators: [Indicators::Case::WORKFLOW_TEAM]
  ).freeze

  CASE_RISK = Dashboard.new(
    name: 'case_risk',
    type: 'indicator',
    indicators: [Indicators::Case::RISK]
  ).freeze

  APPROVALS_ASSESSMENT = Dashboard.new(
    name: 'approvals_assessment',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_ASSESSMENT_PENDING,
      Indicators::Case::APPROVALS_ASSESSMENT_REJECTED,
      Indicators::Case::APPROVALS_ASSESSMENT_APPROVED
    ]
  ).freeze

  APPROVALS_CASE_PLAN = Dashboard.new(
    name: 'approvals_case_plan',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_CASE_PLAN_PENDING,
      Indicators::Case::APPROVALS_CASE_PLAN_REJECTED,
      Indicators::Case::APPROVALS_CASE_PLAN_APPROVED
    ]
  ).freeze

  APPROVALS_CLOSURE = Dashboard.new(
    name: 'approvals_closure',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_CLOSURE_PENDING,
      Indicators::Case::APPROVALS_CLOSURE_REJECTED,
      Indicators::Case::APPROVALS_CLOSURE_APPROVED
    ]
  ).freeze

  APPROVALS_ACTION_PLAN = Dashboard.new(
    name: 'approvals_action_plan',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_ACTION_PLAN_PENDING,
      Indicators::Case::APPROVALS_ACTION_PLAN_REJECTED,
      Indicators::Case::APPROVALS_ACTION_PLAN_APPROVED
    ]
  ).freeze

  APPROVALS_GBV_CLOSURE = Dashboard.new(
    name: 'approvals_gbv_closure',
    type: 'indicator',
    indicators: [
      Indicators::Case::APPROVALS_GBV_CLOSURE_PENDING,
      Indicators::Case::APPROVALS_GBV_CLOSURE_REJECTED,
      Indicators::Case::APPROVALS_GBV_CLOSURE_APPROVED
    ]
  ).freeze

  APPROVALS_ASSESSMENT_PENDING = Dashboard.new(
    name: 'approvals_assessment_pending',
    type: 'indicator',
    indicators: [Indicators::Case::APPROVALS_ASSESSMENT_PENDING_GROUP]
  ).freeze

  APPROVALS_CASE_PLAN_PENDING = Dashboard.new(
    name: 'approvals_case_plan_pending',
    type: 'indicator',
    indicators: [Indicators::Case::APPROVALS_CASE_PLAN_PENDING_GROUP]
  ).freeze

  APPROVALS_CLOSURE_PENDING = Dashboard.new(
    name: 'approvals_closure_pending',
    type: 'indicator',
    indicators: [Indicators::Case::APPROVALS_CLOSURE_PENDING_GROUP]
  ).freeze

  APPROVALS_ACTION_PLAN_PENDING = Dashboard.new(
    name: 'approvals_action_plan_pending',
    type: 'indicator',
    indicators: [Indicators::Case::APPROVALS_ACTION_PLAN_PENDING_GROUP]
  ).freeze

  APPROVALS_GBV_CLOSURE_PENDING = Dashboard.new(
    name: 'approvals_gbv_closure_pending',
    type: 'indicator',
    indicators: [Indicators::Case::APPROVALS_GBV_CLOSURE_PENDING_GROUP]
  ).freeze

  def self.cases_by_task_overdue_assessment
    Dashboard.new(
      name: 'cases_by_task_overdue_assessment',
      type: 'indicator',
      indicators: [Indicators::Case.tasks_overdue_assessment]
    )
  end

  def self.cases_by_task_overdue_case_plan
    Dashboard.new(
      name: 'cases_by_task_overdue_case_plan',
      type: 'indicator',
      indicators: [Indicators::Case.tasks_overdue_case_plan]
    )
  end

  def self.cases_by_task_overdue_services
    Dashboard.new(
      name: 'cases_by_task_overdue_services',
      type: 'indicator',
      indicators: [Indicators::Case.tasks_overdue_services]
    )
  end

  def self.cases_by_task_overdue_followups
    Dashboard.new(
      name: 'cases_by_task_overdue_followups',
      type: 'indicator',
      indicators: [Indicators::Case.tasks_overdue_followups]
    )
  end

  def self.dash_protection_concerns
    Dashboard.new(
      name: 'dash_protection_concerns',
      type: 'indicator',
      indicators: [
        Indicators::Case::PROTECTION_CONCERNS_OPEN_CASES,
        Indicators::Case.protection_concerns_new_this_week,
        Indicators::Case::PROTECTION_CONCERNS_ALL_CASES,
        Indicators::Case.protection_concerns_closed_this_week
      ]
    )
  end

  DASH_SHARED_WITH_OTHERS = Dashboard.new(
    name: 'dash_shared_with_others',
    type: 'indicator',
    indicators: [
      Indicators::Case::SHARED_WITH_OTHERS_REFERRALS,
      Indicators::Case::SHARED_WITH_OTHERS_PENDING_TRANSFERS,
      Indicators::Case::SHARED_WITH_OTHERS_REJECTED_TRANSFERS
    ]
  ).freeze

  DASH_SHARED_WITH_ME = Dashboard.new(
    name: 'dash_shared_with_me',
    type: 'indicator',
    indicators: [
      Indicators::Case::SHARED_WITH_ME_TOTAL_REFERRALS,
      Indicators::Case::SHARED_WITH_ME_NEW_REFERRALS,
      Indicators::Case::SHARED_WITH_ME_TRANSFERS_AWAITING_ACCEPTANCE
    ]
  ).freeze

  DASH_GROUP_OVERVIEW = Dashboard.new(
    name: 'dash_group_overview',
    type: 'indicator',
    indicators: [
      Indicators::Case::GROUP_OVERVIEW_OPEN,
      Indicators::Case::GROUP_OVERVIEW_CLOSED
    ]
  ).freeze

  DASH_SHARED_FROM_MY_TEAM = Dashboard.new(
    name: 'dash_shared_from_my_team',
    type: 'indicator',
    indicators: [
      Indicators::Case::SHARED_FROM_MY_TEAM_REFERRALS,
      Indicators::Case::SHARED_FROM_MY_TEAM_PENDING_TRANSFERS,
      Indicators::Case::SHARED_FROM_MY_TEAM_REJECTED_TRANSFERS
    ]
  ).freeze

  DASH_SHARED_WITH_MY_TEAM = Dashboard.new(
    name: 'dash_shared_with_my_team',
    type: 'indicator',
    indicators: [
      Indicators::Case::SHARED_WITH_MY_TEAM_REFERRALS,
      Indicators::Case::SHARED_WITH_MY_TEAM_PENDING_TRANSFERS
    ]
  ).freeze

  DASH_CASE_INCIDENT_OVERVIEW = Dashboard.new(
    name: 'dash_case_incident_overview',
    type: 'indicator',
    indicators: [
      Indicators::Case::OPEN,
      Indicators::Case::UPDATED,
      Indicators::Case::WITH_INCIDENTS,
      Indicators::Case::WITH_NEW_INCIDENTS,
      Indicators::Case::WITHOUT_INCIDENTS
    ].freeze
  )

  DASH_CASES_BY_SOCIAL_WORKER = Dashboard.new(
    name: 'dash_cases_by_social_worker',
    type: 'indicator',
    indicators: Indicators::Case::CASES_BY_SOCIAL_WORKER
  ).freeze

  def self.dash_reporting_location(role = nil)
    Dashboard.new(
      name: 'reporting_location',
      type: 'indicator',
      indicators: Indicators::Case.reporting_location_indicators(role)
    )
  end

  def self.dash_cases_to_assign
    Dashboard.new(
      name: 'dash_cases_to_assign',
      type: 'indicator',
      indicators: Indicators::Case.cases_to_assign
    )
  end

  def self.dash_national_admin_summary
    Dashboard.new(
      name: 'dash_national_admin_summary',
      type: 'indicator',
      indicators: [
        Indicators::Case::NATIONAL_ADMIN_SUMMARY_OPEN,
        Indicators::Case.new_last_week, Indicators::Case.new_this_week,
        Indicators::Case.closed_last_week, Indicators::Case.closed_this_week
      ]
    )
  end
end
# rubocop:enable Metrics/ClassLength
