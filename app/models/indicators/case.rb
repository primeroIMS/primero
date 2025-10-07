# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Case Class for Indicators
  # rubocop:disable Metrics/ClassLength
  class Case
    # rubocop:enable Style/ClassAndModuleChildren
    OPEN_ENABLED = [
      SearchFilters::BooleanValue.new(field_name: 'record_state', value: true),
      SearchFilters::TextValue.new(field_name: 'status', value: Record::STATUS_OPEN)
    ].freeze

    CLOSED_ENABLED = [
      SearchFilters::BooleanValue.new(field_name: 'record_state', value: true),
      SearchFilters::TextValue.new(field_name: 'status', value: Record::STATUS_CLOSED)
    ].freeze

    OPEN_CLOSED_ENABLED = [
      SearchFilters::BooleanValue.new(field_name: 'record_state', value: true),
      SearchFilters::TextList.new(field_name: 'status', values: [Record::STATUS_OPEN, Record::STATUS_CLOSED])
    ].freeze

    OPEN = QueriedIndicator.new(
      name: 'total',
      record_model: Child,
      queries: OPEN_ENABLED
    ).freeze

    # NEW = TODO: Cases that have just been assigned to me. Need extra work.

    UPDATED = QueriedIndicator.new(
      name: 'new_or_updated',
      record_model: Child,
      queries: OPEN_ENABLED + [
        SearchFilters::BooleanValue.new(field_name: 'not_edited_by_owner', value: true)
      ]
    ).freeze

    def self.closed_recently
      QueriedIndicator.new(
        name: 'closed_recently',
        record_model: Child,
        queries: CLOSED_ENABLED + [
          SearchFilters::DateRange.new(
            field_name: 'date_closure', from: SearchFilters::DateRange.recent_past, to: SearchFilters::DateRange.present
          )
        ],
        scope_to_owner: true
      )
    end

    CASES_BY_SOCIAL_WORKER = [
      GroupedIndicator.new(
        name: 'cases_by_social_worker_total',
        record_model: Child,
        pivots: [{ field_name: 'owned_by' }],
        scope: OPEN_ENABLED,
        scope_to_owned_by_groups: true,
        exclude_zeros: true
      ),
      GroupedIndicator.new(
        name: 'cases_by_social_worker_new_or_updated',
        record_model: Child,
        pivots: [{ field_name: 'owned_by' }],
        scope: OPEN_ENABLED + [
          SearchFilters::BooleanValue.new(field_name: 'not_edited_by_owner', value: true)
        ]
      )
    ].freeze

    RISK = GroupedIndicator.new(
      name: 'risk_level',
      pivots: [{ field_name: 'risk_level' }],
      record_model: Child,
      scope: OPEN_ENABLED
    ).freeze

    def self.approvals_assessment_pending(module_id)
      approval_indicator(name: "approval_assessment_pending.#{module_id}", field_name: 'approval_status_assessment',
                         value: Approval::APPROVAL_STATUS_PENDING, module_id:)
    end

    def self.approvals_assessment_pending_group(module_id)
      approval_indicator(name: "approval_assessment_pending_group.#{module_id}",
                         field_name: 'approval_status_assessment',
                         value: Approval::APPROVAL_STATUS_PENDING, module_id:, scope_to_owner: false)
    end

    def self.approvals_assessment_rejected(module_id)
      approval_indicator(name: "approval_assessment_rejected.#{module_id}", field_name: 'approval_status_assessment',
                         value: Approval::APPROVAL_STATUS_REJECTED, module_id:)
    end

    def self.approvals_assessment_approved(module_id)
      approval_indicator(name: "approval_assessment_approved.#{module_id}", field_name: 'approval_status_assessment',
                         value: Approval::APPROVAL_STATUS_APPROVED, module_id:)
    end

    def self.approvals_case_plan_pending(module_id)
      approval_indicator(name: "approval_case_plan_pending.#{module_id}", field_name: 'approval_status_case_plan',
                         value: Approval::APPROVAL_STATUS_PENDING, module_id:)
    end

    def self.approvals_case_plan_pending_group(module_id)
      approval_indicator(name: "approval_case_plan_pending_group.#{module_id}", field_name: 'approval_status_case_plan',
                         value: Approval::APPROVAL_STATUS_PENDING, module_id:, scope_to_owner: false)
    end

    def self.approvals_case_plan_rejected(module_id)
      approval_indicator(name: "approval_case_plan_rejected.#{module_id}", field_name: 'approval_status_case_plan',
                         value: Approval::APPROVAL_STATUS_REJECTED, module_id:)
    end

    def self.approvals_case_plan_approved(module_id)
      approval_indicator(name: "approval_case_plan_approved.#{module_id}", field_name: 'approval_status_case_plan',
                         value: Approval::APPROVAL_STATUS_APPROVED, module_id:)
    end

    def self.approvals_closure_pending(module_id)
      approval_indicator(name: "approval_closure_pending.#{module_id}", field_name: 'approval_status_closure',
                         value: Approval::APPROVAL_STATUS_PENDING, module_id:)
    end

    def self.approvals_closure_pending_group(module_id)
      approval_indicator(name: "approval_closure_pending_group.#{module_id}", field_name: 'approval_status_closure',
                         value: Approval::APPROVAL_STATUS_PENDING, module_id:, scope_to_owner: false)
    end

    def self.approvals_closure_rejected(module_id)
      approval_indicator(name: "approval_closure_rejected.#{module_id}", field_name: 'approval_status_closure',
                         value: Approval::APPROVAL_STATUS_REJECTED, module_id:)
    end

    def self.approvals_closure_approved(module_id)
      approval_indicator(name: "approval_closure_approved.#{module_id}", field_name: 'approval_status_closure',
                         value: Approval::APPROVAL_STATUS_APPROVED, module_id:)
    end

    def self.approvals_action_plan_pending(module_id)
      approval_indicator(name: "approval_action_plan_pending.#{module_id}", field_name: 'approval_status_action_plan',
                         value: Approval::APPROVAL_STATUS_PENDING, module_id:)
    end

    def self.approvals_action_plan_pending_group(module_id)
      approval_indicator(name: "approval_action_plan_pending_group.#{module_id}",
                         field_name: 'approval_status_action_plan',
                         value: Approval::APPROVAL_STATUS_PENDING, module_id:, scope_to_owner: false)
    end

    def self.approvals_action_plan_rejected(module_id)
      approval_indicator(name: "approval_action_plan_rejected.#{module_id}", field_name: 'approval_status_action_plan',
                         value: Approval::APPROVAL_STATUS_REJECTED, module_id:)
    end

    def self.approvals_action_plan_approved(module_id)
      approval_indicator(name: "approval_action_plan_approved.#{module_id}", field_name: 'approval_status_action_plan',
                         value: Approval::APPROVAL_STATUS_APPROVED, module_id:)
    end

    def self.approvals_gbv_closure_pending(module_id)
      approval_indicator(name: "approval_gbv_closure_pending.#{module_id}", field_name: 'approval_status_gbv_closure',
                         value: Approval::APPROVAL_STATUS_PENDING, module_id:)
    end

    def self.approvals_gbv_closure_pending_group(module_id)
      approval_indicator(name: "approval_gbv_closure_pending_group.#{module_id}",
                         field_name: 'approval_status_gbv_closure',
                         value: Approval::APPROVAL_STATUS_PENDING, module_id:, scope_to_owner: false)
    end

    def self.approvals_gbv_closure_rejected(module_id)
      approval_indicator(name: "approval_gbv_closure_rejected.#{module_id}", field_name: 'approval_status_gbv_closure',
                         value: Approval::APPROVAL_STATUS_REJECTED, module_id:)
    end

    def self.approvals_gbv_closure_approved(module_id)
      approval_indicator(name: "approval_gbv_closure_approved.#{module_id}", field_name: 'approval_status_gbv_closure',
                         value: Approval::APPROVAL_STATUS_APPROVED, module_id:)
    end

    def self.tasks_overdue_assessment
      GroupedIndicator.new(
        name: 'tasks_overdue_assessment',
        pivots: [{ field_name: 'owned_by', constrained: true }],
        record_model: Child,
        scope: overdue_assesment_scope
      )
    end

    def self.overdue_assesment_scope
      OPEN_ENABLED + [
        SearchFilters::DateRange.new(
          field_name: 'assessment_due_dates',
          from: SearchFilters::DateRange.dawn_of_time,
          to: SearchFilters::DateRange.present
        )
      ]
    end

    def self.tasks_overdue_case_plan
      GroupedIndicator.new(
        name: 'tasks_overdue_case_plan',
        pivots: [{ field_name: 'owned_by', constrained: true }],
        record_model: Child,
        scope: overdue_case_plan_scope
      )
    end

    def self.overdue_case_plan_scope
      OPEN_ENABLED + [
        SearchFilters::DateRange.new(
          field_name: 'case_plan_due_dates',
          from: SearchFilters::DateRange.dawn_of_time,
          to: SearchFilters::DateRange.present
        )
      ]
    end

    def self.tasks_overdue_services
      GroupedIndicator.new(
        name: 'tasks_overdue_services',
        pivots: [{ field_name: 'owned_by', constrained: true }],
        record_model: Child,
        scope: overdue_services_scope
      )
    end

    def self.overdue_services_scope
      OPEN_ENABLED + [
        SearchFilters::DateRange.new(
          field_name: 'service_due_dates',
          from: SearchFilters::DateRange.dawn_of_time,
          to: SearchFilters::DateRange.present
        )
      ]
    end

    def self.tasks_overdue_followups
      GroupedIndicator.new(
        name: 'tasks_overdue_followups',
        pivots: [{ field_name: 'owned_by', constrained: true }],
        record_model: Child,
        scope: overdue_followup_scope
      )
    end

    def self.overdue_followup_scope
      OPEN_ENABLED + [
        SearchFilters::DateRange.new(
          field_name: 'followup_due_dates',
          from: SearchFilters::DateRange.dawn_of_time,
          to: SearchFilters::DateRange.present
        )
      ]
    end

    PROTECTION_CONCERNS_OPEN_CASES = GroupedIndicator.new(
      name: 'protection_concerns_open_cases',
      pivots: [{ field_name: 'protection_concerns', multivalue: true }],
      record_model: Child,
      scope: OPEN_ENABLED
    ).freeze

    def self.protection_concerns_new_this_week
      GroupedIndicator.new(
        name: 'protection_concerns_new_this_week',
        pivots: [{ field_name: 'protection_concerns', multivalue: true }],
        record_model: Child,
        scope: OPEN_ENABLED + [SearchFilters::DateRange.this_week('created_at')]
      )
    end

    PROTECTION_CONCERNS_ALL_CASES = GroupedIndicator.new(
      name: 'protection_concerns_all_cases',
      pivots: [{ field_name: 'protection_concerns', multivalue: true }],
      record_model: Child,
      scope: [SearchFilters::BooleanValue.new(field_name: 'record_state', value: true)]
    ).freeze

    def self.protection_concerns_closed_this_week
      GroupedIndicator.new(
        name: 'protection_concerns_closed_this_week',
        pivots: [{ field_name: 'protection_concerns', multivalue: true }],
        record_model: Child,
        scope: [
          SearchFilters::BooleanValue.new(field_name: 'record_state', value: true),
          SearchFilters::TextValue.new(field_name: 'status', value: Record::STATUS_CLOSED),
          SearchFilters::DateRange.this_week('date_closure')
        ]
      )
    end

    SHARED_WITH_OTHERS_REFERRALS = QueriedIndicator.new(
      name: 'shared_with_others_referrals',
      record_model: Child,
      queries: OPEN_ENABLED + [
        SearchFilters::BooleanValue.new(field_name: 'referred_users_present', value: true)
      ],
      scope_to_owner: true
    ).freeze

    SHARED_WITH_OTHERS_PENDING_TRANSFERS = QueriedIndicator.new(
      name: 'shared_with_others_pending_transfers',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::TextValue.new(field_name: 'transfer_status', value: Transition::STATUS_INPROGRESS)
      ]
    ).freeze

    SHARED_WITH_OTHERS_REJECTED_TRANSFERS = QueriedIndicator.new(
      name: 'shared_with_others_rejected_transfers',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::TextValue.new(field_name: 'transfer_status', value: Transition::STATUS_REJECTED)
      ]
    ).freeze

    SHARED_WITH_ME_TOTAL_REFERRALS = QueriedIndicator.new(
      name: 'shared_with_me_total_referrals',
      record_model: Child,
      queries: OPEN_ENABLED,
      scope_to_referred: true
    ).freeze

    SHARED_WITH_ME_NEW_REFERRALS = QueriedIndicator.new(
      name: 'shared_with_me_new_referrals',
      record_model: Child,
      queries: OPEN_ENABLED,
      scope_to_referred: true,
      scope_to_not_last_update: true
    ).freeze

    SHARED_WITH_ME_TRANSFERS_AWAITING_ACCEPTANCE = QueriedIndicator.new(
      name: 'shared_with_me_transfers_awaiting_acceptance',
      record_model: Child,
      queries: OPEN_ENABLED,
      scope_to_transferred: true
    ).freeze

    GROUP_OVERVIEW_OPEN = QueriedIndicator.new(
      name: 'group_overview_open',
      record_model: Child,
      queries: OPEN_ENABLED
    ).freeze

    GROUP_OVERVIEW_CLOSED = QueriedIndicator.new(
      name: 'group_overview_closed',
      record_model: Child,
      queries: CLOSED_ENABLED
    ).freeze

    SHARED_FROM_MY_TEAM_REFERRALS = GroupedIndicator.new(
      name: 'shared_from_my_team_referrals',
      pivots: [{ field_name: 'owned_by' }],
      exclude_zeros: true,
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::BooleanValue.new(field_name: 'referred_users_present', value: true)
      ],
      scope_to_owned_by_groups: true
    ).freeze

    SHARED_FROM_MY_TEAM_PENDING_TRANSFERS = GroupedIndicator.new(
      name: 'shared_from_my_team_pending_transfers',
      pivots: [{ field_name: 'owned_by' }],
      exclude_zeros: true,
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::TextValue.new(field_name: 'transfer_status', value: Transition::STATUS_INPROGRESS)
      ],
      scope_to_owned_by_groups: true
    ).freeze

    SHARED_FROM_MY_TEAM_REJECTED_TRANSFERS = GroupedIndicator.new(
      name: 'shared_from_my_team_rejected_transfers',
      pivots: [{ field_name: 'owned_by' }],
      exclude_zeros: true,
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::TextValue.new(field_name: 'transfer_status', value: Transition::STATUS_REJECTED)
      ],
      scope_to_owned_by_groups: true
    ).freeze

    SHARED_WITH_MY_TEAM_REFERRALS = GroupedIndicator.new(
      name: 'shared_with_my_team_referrals',
      record_model: Child,
      pivots: [{ field_name: 'referred_users', multivalue: true, constrained: true }],
      exclude_zeros: true,
      scope: OPEN_ENABLED + [
        SearchFilters::BooleanValue.new(field_name: 'referred_users_present', value: true)
      ]
    )

    SHARED_WITH_MY_TEAM_PENDING_TRANSFERS = GroupedIndicator.new(
      name: 'shared_with_my_team_pending_transfers',
      transition_model: Transfer,
      pivots: [{ field_name: 'transferred_to_users', multivalue: true, constrained: true }],
      record_model: Child,
      exclude_zeros: true,
      scope: OPEN_ENABLED
    )

    SHARED_WITH_MY_TEAM_PENDING_TRANSFERS_OVERVIEW = QueriedIndicator.new(
      name: 'shared_with_my_team_pending_transfers_overview',
      record_model: Child,
      queries: OPEN_ENABLED + [
        SearchFilters::TextValue.new(field_name: 'transfer_status', value: Transition::STATUS_INPROGRESS)
      ],
      scope_to_transferred_groups: true
    ).freeze

    WITH_INCIDENTS = QueriedIndicator.new(
      name: 'with_incidents',
      record_model: Child,
      queries: OPEN_ENABLED + [
        SearchFilters::BooleanValue.new(field_name: 'has_incidents', value: true)
      ]
    ).freeze

    WITH_NEW_INCIDENTS = QueriedIndicator.new(
      name: 'with_new_incidents',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::TextValue.new(field_name: 'current_alert_types', value: Alertable::INCIDENT_FROM_CASE)
      ]
    ).freeze

    WITHOUT_INCIDENTS = QueriedIndicator.new(
      name: 'without_incidents',
      record_model: Child,
      queries: OPEN_ENABLED + [
        SearchFilters::BooleanValue.new(field_name: 'has_incidents', value: false)
      ]
    ).freeze

    NATIONAL_ADMIN_SUMMARY_OPEN = QueriedIndicator.new(
      name: 'open',
      record_model: Child,
      queries: OPEN_ENABLED
    ).freeze

    def self.reporting_location_indicators(role)
      reporting_location_config = role&.reporting_location_config
      admin_level = reporting_location_config&.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL
      field_key = reporting_location_config&.field_key || ReportingLocation::DEFAULT_FIELD_KEY
      [
        reporting_location_open(field_key, admin_level),
        reporting_location_open_last_week(field_key, admin_level),
        reporting_location_open_this_week(field_key, admin_level),
        reporting_location_closed_last_week(field_key, admin_level),
        reporting_location_closed_this_week(field_key, admin_level)
      ]
    end

    def self.reporting_location_open(field_name, admin_level)
      GroupedIndicator.new(
        name: 'reporting_location_open',
        pivots: [{ field_name:, admin_level:, type: 'location' }],
        record_model: Child,
        scope: OPEN_ENABLED
      )
    end

    def self.reporting_location_open_last_week(field_name, admin_level)
      GroupedIndicator.new(
        name: 'reporting_location_open_last_week',
        pivots: [{ field_name:, admin_level:, type: 'location' }],
        record_model: Child,
        scope: OPEN_ENABLED + [SearchFilters::DateRange.last_week('created_at')]
      )
    end

    def self.reporting_location_open_this_week(field_name, admin_level)
      GroupedIndicator.new(
        name: 'reporting_location_open_this_week',
        pivots: [{ field_name:, admin_level:, type: 'location' }],
        record_model: Child,
        scope: OPEN_ENABLED + [SearchFilters::DateRange.this_week('created_at')]
      )
    end

    def self.reporting_location_closed_last_week(field_name, admin_level)
      GroupedIndicator.new(
        name: 'reporting_location_closed_last_week',
        pivots: [{ field_name:, admin_level:, type: 'location' }],
        record_model: Child,
        scope: CLOSED_ENABLED + [SearchFilters::DateRange.last_week('date_closure')]
      )
    end

    def self.reporting_location_closed_this_week(field_name, admin_level)
      GroupedIndicator.new(
        name: 'reporting_location_closed_this_week',
        pivots: [{ field_name:, admin_level:, type: 'location' }],
        record_model: Child,
        scope: CLOSED_ENABLED + [SearchFilters::DateRange.this_week('date_closure')]
      )
    end

    def self.cases_to_assign
      # TODO: Candidate for caching.
      risk_levels = (Lookup.find_by(unique_id: 'lookup-risk-level')&.lookup_values || []).map { |value| value['id'] }
      risk_level_indicators(risk_levels) + overdue_risk_level_indicators(risk_levels)
    end

    def self.risk_level_indicators(risk_levels)
      [QueriedIndicator.new(
        name: 'cases_none',
        scope_to_owner: true,
        record_model: Child,
        queries: OPEN_ENABLED + [
          SearchFilters::Not.new(filter: SearchFilters::TextList.new(field_name: 'risk_level', values: risk_levels))
        ]
      )] + risk_levels.map { |risk_level| risk_level_indicator(risk_level) }
    end

    def self.overdue_risk_level_indicators(risk_levels)
      [QueriedIndicator.new(
        name: 'overdue_cases_none',
        scope_to_owner: true,
        record_model: Child,
        queries: overdue_none_risk_level_queries(risk_levels)
      )] + risk_levels.map { |risk_level| overdue_risk_level_indicator(risk_level) }
    end

    def self.risk_level_indicator(risk_level)
      QueriedIndicator.new(
        name: "cases_#{risk_level}",
        scope_to_owner: true,
        record_model: Child,
        queries: OPEN_ENABLED + [
          SearchFilters::TextValue.new(field_name: 'risk_level', value: risk_level)
        ]
      )
    end

    def self.overdue_risk_level_indicator(risk_level)
      QueriedIndicator.new(
        name: "overdue_cases_#{risk_level}",
        scope_to_owner: true,
        record_model: Child,
        queries: overdue_risk_level_queries(risk_level)
      )
    end

    def self.overdue_none_risk_level_queries(risk_levels)
      OPEN_ENABLED + [
        SearchFilters::Not.new(filter: SearchFilters::TextList.new(field_name: 'risk_level', values: risk_levels)),
        SearchFilters::DateRange.new(
          field_name: 'reassigned_transferred_on',
          from: Time.at(0),
          to: Time.now - SystemSettings.current.timeframe_hours_to_assign.hour
        )
      ]
    end

    def self.overdue_risk_level_queries(risk_level)
      timeframe = SystemSettings.current.timeframe_hours_to_assign.hour
      timeframe = SystemSettings.current.timeframe_hours_to_assign_high.hour if risk_level == 'high'

      OPEN_ENABLED + [
        SearchFilters::DateRange.new(
          field_name: 'reassigned_transferred_on',
          from: Time.at(0),
          to: Time.now - timeframe
        ),
        SearchFilters::TextValue.new(field_name: 'risk_level', value: risk_level)
      ]
    end

    def self.new_this_week
      QueriedIndicator.new(
        name: 'new_this_week',
        record_model: Child,
        queries: OPEN_ENABLED + [SearchFilters::DateRange.this_week('created_at')]
      )
    end

    def self.new_last_week
      QueriedIndicator.new(
        name: 'new_last_week',
        record_model: Child,
        queries: OPEN_ENABLED + [SearchFilters::DateRange.last_week('created_at')]
      )
    end

    def self.closed_this_week
      QueriedIndicator.new(
        name: 'closed_this_week',
        record_model: Child,
        queries: CLOSED_ENABLED + [SearchFilters::DateRange.this_week('date_closure')].freeze
      )
    end

    def self.closed_last_week
      QueriedIndicator.new(
        name: 'closed_last_week',
        record_model: Child,
        queries: CLOSED_ENABLED + [SearchFilters::DateRange.last_week('date_closure')].freeze
      )
    end

    # rubocop:disable Metrics/MethodLength
    def self.workflow_team(role)
      role_modules = role.modules.reject do |primero_module|
        [PrimeroModule::GBV, PrimeroModule::MRM].include?(primero_module)
      end

      role_modules.map do |primero_module|
        GroupedIndicator.new(
          name: "workflow_team_#{primero_module.unique_id}",
          record_model: Child,
          pivots: [{ field_name: 'owned_by', constrained: true }, { field_name: 'workflow' }],
          scope: OPEN_CLOSED_ENABLED + [SearchFilters::TextValue.new(field_name: 'module_id',
                                                                     value: primero_module.unique_id)],
          scope_to_owned_by_groups: true
        ).freeze
      end
    end

    def self.approval_indicator(name:, field_name:, value:, module_id:, scope_to_owner: true)
      QueriedIndicator.new(
        name: name,
        record_model: Child,
        scope_to_owner:,
        queries: OPEN_ENABLED + [
          SearchFilters::TextValue.new(field_name: field_name,
                                       value: value),
          SearchFilters::TextValue.new(field_name: 'module_id',
                                       value: module_id)
        ]
      ).freeze
    end

    def self.workflows(role)
      role_modules = role.modules.reject do |primero_module|
        [PrimeroModule::GBV, PrimeroModule::MRM].include?(primero_module)
      end

      role_modules.map do |primero_module|
        GroupedIndicator.new(
          name: "workflow_#{primero_module.unique_id}",
          pivots: [{ field_name: 'workflow' }],
          record_model: Child,
          scope: OPEN_CLOSED_ENABLED + [SearchFilters::TextValue.new(field_name: 'module_id',
                                                                     value: primero_module.unique_id)],
          scope_to_owner: true
        ).freeze
      end
    end
    # rubocop:enable Metrics/MethodLength
  end
  # rubocop:enable Metrics/ClassLength
end
