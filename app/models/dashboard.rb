# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
    dash_violations_category_region
  ].freeze

  DYMANIC_WITH_SELF = %w[
    dash_reporting_location
    dash_violations_category_region
    workflow approvals_assessment
    approvals_case_plan
    approvals_closure
    approvals_action_plan
    approvals_gbv_closure
    approvals_assessment_pending
    approvals_case_plan_pending
    approvals_closure_pending
    approvals_action_plan_pending
    approvals_gbv_closure_pending
    workflow
    workflow_team
  ].freeze

  # NOTE: The constant name of each Dashboard needs to match the value of the corresponding Permission

  CASE_OVERVIEW = Dashboard.new(
    name: 'case_overview',
    type: 'indicator',
    indicators: [
      Indicators::Case::OPEN, Indicators::Case::UPDATED
    ]
  ).freeze

  CASE_RISK = Dashboard.new(
    name: 'case_risk',
    type: 'indicator',
    indicators: [Indicators::Case::RISK]
  ).freeze

  ACTION_NEEDED_NEW_UPDATED = Dashboard.new(
    name: 'action_needed_new_updated',
    type: 'indicator',
    indicators: [Indicators::Case::UPDATED]
  ).freeze

  ACTION_NEEDED_NEW_REFERRALS = Dashboard.new(
    name: 'action_needed_new_referrals',
    type: 'indicator',
    indicators: [
      Indicators::Case::SHARED_WITH_ME_NEW_REFERRALS
    ]
  ).freeze

  ACTION_NEEDED_TRANSFER_AWAITING_ACCEPTANCE = Dashboard.new(
    name: 'action_needed_transfer_awaiting_acceptance',
    type: 'indicator',
    indicators: [
      Indicators::Case::SHARED_WITH_ME_TRANSFERS_AWAITING_ACCEPTANCE
    ]
  ).freeze

  # rubocop:disable Metrics/MethodLength
  def self.approvals_assessment(role = nil)
    role.modules.map do |primero_module|
      Dashboard.new(
        name: "approvals_assessment.#{primero_module.unique_id}",
        type: 'indicator',
        indicators: [
          Indicators::Case.approvals_assessment_pending(primero_module.unique_id),
          Indicators::Case.approvals_assessment_rejected(primero_module.unique_id),
          Indicators::Case.approvals_assessment_approved(primero_module.unique_id)
        ]
      ).freeze
    end
  end

  def self.approvals_case_plan(role = nil)
    role.modules.map do |primero_module|
      Dashboard.new(
        name: "approvals_case_plan.#{primero_module.unique_id}",
        type: 'indicator',
        indicators: [
          Indicators::Case.approvals_case_plan_pending(primero_module.unique_id),
          Indicators::Case.approvals_case_plan_rejected(primero_module.unique_id),
          Indicators::Case.approvals_case_plan_approved(primero_module.unique_id)
        ]
      ).freeze
    end
  end

  def self.approvals_closure(role = nil)
    role.modules.map do |primero_module|
      Dashboard.new(
        name: "approvals_closure.#{primero_module.unique_id}",
        type: 'indicator',
        indicators: [
          Indicators::Case.approvals_closure_pending(primero_module.unique_id),
          Indicators::Case.approvals_closure_rejected(primero_module.unique_id),
          Indicators::Case.approvals_closure_approved(primero_module.unique_id)
        ]
      ).freeze
    end
  end

  def self.approvals_action_plan(role = nil)
    role.modules.map do |primero_module|
      Dashboard.new(
        name: "approvals_action_plan.#{primero_module.unique_id}",
        type: 'indicator',
        indicators: [
          Indicators::Case.approvals_action_plan_pending(primero_module.unique_id),
          Indicators::Case.approvals_action_plan_rejected(primero_module.unique_id),
          Indicators::Case.approvals_action_plan_approved(primero_module.unique_id)
        ]
      ).freeze
    end
  end

  def self.approvals_gbv_closure(role = nil)
    role.modules.map do |primero_module|
      Dashboard.new(
        name: "approvals_gbv_closure.#{primero_module.unique_id}",
        type: 'indicator',
        indicators: [
          Indicators::Case.approvals_gbv_closure_pending(primero_module.unique_id),
          Indicators::Case.approvals_gbv_closure_rejected(primero_module.unique_id),
          Indicators::Case.approvals_gbv_closure_approved(primero_module.unique_id)
        ]
      ).freeze
    end
  end
  # rubocop:enable Metrics/MethodLength

  def self.approvals_assessment_pending(role = nil)
    role.modules.map do |primero_module|
      Dashboard.new(
        name: "approvals_assessment_pending.#{primero_module.unique_id}",
        type: 'indicator',
        indicators: [Indicators::Case.approvals_assessment_pending_group(primero_module.unique_id)]
      ).freeze
    end
  end

  def self.approvals_case_plan_pending(role = nil)
    role.modules.map do |primero_module|
      Dashboard.new(
        name: "approvals_case_plan_pending.#{primero_module.unique_id}",
        type: 'indicator',
        indicators: [Indicators::Case.approvals_case_plan_pending_group(primero_module.unique_id)]
      ).freeze
    end
  end

  def self.approvals_closure_pending(role = nil)
    role.modules.map do |primero_module|
      Dashboard.new(
        name: "approvals_closure_pending.#{primero_module.unique_id}",
        type: 'indicator',
        indicators: [Indicators::Case.approvals_closure_pending_group(primero_module.unique_id)]
      ).freeze
    end
  end

  def self.approvals_action_plan_pending(role = nil)
    role.modules.map do |primero_module|
      Dashboard.new(
        name: "approvals_action_plan_pending.#{primero_module.unique_id}",
        type: 'indicator',
        indicators: [Indicators::Case.approvals_action_plan_pending_group(primero_module.unique_id)]
      ).freeze
    end
  end

  def self.approvals_gbv_closure_pending(role = nil)
    role.modules.map do |primero_module|
      Dashboard.new(
        name: "approvals_gbv_closure_pending.#{primero_module.unique_id}",
        type: 'indicator',
        indicators: [Indicators::Case.approvals_gbv_closure_pending_group(primero_module.unique_id)]
      ).freeze
    end
  end

  DASH_VIOLATIONS_CATEGORY_VERIFICATION_STATUS = Dashboard.new(
    name: 'dash_violations_category_verification_status',
    type: 'indicator',
    indicators: [Indicators::Incident::VIOLATIONS_CATEGORY_VERIFICATION_STATUS]
  ).freeze

  DASH_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES = Dashboard.new(
    name: 'dash_perpetrator_armed_force_group_party_names',
    type: 'indicator',
    indicators: [Indicators::Incident::PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES]
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

  DASH_SHARED_WITH_MY_TEAM_OVERVIEW = Dashboard.new(
    name: 'dash_shared_with_my_team_overview',
    type: 'indicator',
    indicators: [
      Indicators::Case::SHARED_WITH_MY_TEAM_PENDING_TRANSFERS_OVERVIEW
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

  def self.dash_violations_category_region(role = nil)
    Dashboard.new(
      name: 'dash_violations_category_region',
      type: 'indicator',
      indicators: [Indicators::Incident.violation_category_region(role)]
    ).freeze
  end

  def self.workflow(role = nil)
    Dashboard.new(
      name: 'workflow',
      type: 'indicator',
      indicators: Indicators::Case.workflows(role)
    ).freeze
  end

  def self.workflow_team(role = nil)
    Dashboard.new(
      name: 'workflow_team',
      type: 'indicator',
      indicators: Indicators::Case.workflow_team(role)
    ).freeze
  end
end
# rubocop:enable Metrics/ClassLength
