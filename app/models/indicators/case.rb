# frozen_string_literal: true

module Indicators
  class Case
    OPEN_ENABLED = [
      SearchFilters::Value.new(field_name: 'record_state', value: true),
      SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN)
    ].freeze

    CLOSED_ENABLED = [
      SearchFilters::Value.new(field_name: 'record_state', value: true),
      SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_CLOSED)
    ].freeze

    OPEN_CLOSED_ENABLED = [
      SearchFilters::Value.new(field_name: 'record_state', value: true),
      SearchFilters::ValueList.new(field_name: 'status', values: [Record::STATUS_OPEN, Record::STATUS_CLOSED])
    ].freeze

    OPEN = QueriedIndicator.new(
      name: 'total',
      record_model: Child,
      queries: OPEN_ENABLED
    ).freeze

    #NEW = TODO: Cases that have just been assigned to me. Need extra work.

    UPDATED = QueriedIndicator.new(
      name: 'new_or_updated',
      record_model: Child,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'not_edited_by_owner', value: true)
      ]
    ).freeze

    CLOSED_RECENTLY = QueriedIndicator.new(
      name: 'closed_recently',
      record_model: Child,
      queries: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_CLOSED),
        SearchFilters::DateRange.new(
          field_name: 'date_closure', from: QueriedIndicator.recent_past, to: QueriedIndicator.present
        )
      ],
      scope_to_owner: true
    ).freeze

    WORKFLOW = FacetedIndicator.new(
      name: 'workflow',
      facet: 'workflow',
      record_model: Child,
      scope: OPEN_CLOSED_ENABLED,
      scope_to_owner: true
    ).freeze

    WORKFLOW_TEAM = PivotedIndicator.new(
      name: 'workflow_team',
      record_model: Child,
      pivots: %w[owned_by workflow],
      scope: OPEN_CLOSED_ENABLED
    ).freeze

    RISK = FacetedIndicator.new(
      name: 'risk_level',
      facet: 'risk_level',
      record_model: Child,
      scope: OPEN_ENABLED
    ).freeze

    APPROVALS_ASSESSMENT_PENDING = QueriedIndicator.new(
      name: 'approval_assessment_pending',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_bia', value: Approval::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_ASSESSMENT_PENDING_GROUP = QueriedIndicator.new(
      name: 'approval_assessment_pending_group',
      record_model: Child,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_bia', value: Approval::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_ASSESSMENT_REJECTED = QueriedIndicator.new(
      name: 'approval_assessment_rejected',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_bia', value: Approval::APPROVAL_STATUS_REJECTED)
      ]
    ).freeze

    APPROVALS_ASSESSMENT_APPROVED = QueriedIndicator.new(
      name: 'approval_assessment_approved',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_bia', value: Approval::APPROVAL_STATUS_APPROVED)
      ]
    ).freeze

    APPROVALS_CASE_PLAN_PENDING = QueriedIndicator.new(
      name: 'approval_case_plan_pending',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_case_plan', value: Approval::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_CASE_PLAN_PENDING_GROUP = QueriedIndicator.new(
      name: 'approval_case_plan_pending_group',
      record_model: Child,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_case_plan', value: Approval::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_CASE_PLAN_REJECTED = QueriedIndicator.new(
      name: 'approval_case_plan_rejected',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_case_plan', value: Approval::APPROVAL_STATUS_REJECTED)
      ]
    ).freeze

    APPROVALS_CASE_PLAN_APPROVED = QueriedIndicator.new(
      name: 'approval_case_plan_approved',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_case_plan', value: Approval::APPROVAL_STATUS_APPROVED)
      ]
    ).freeze

    APPROVALS_CLOSURE_PENDING = QueriedIndicator.new(
      name: 'approval_closure_pending',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_closure', value: Approval::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_CLOSURE_PENDING_GROUP = QueriedIndicator.new(
      name: 'approval_closure_pending_group',
      record_model: Child,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_closure', value: Approval::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_CLOSURE_REJECTED = QueriedIndicator.new(
      name: 'approval_closure_rejected',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_closure', value: Approval::APPROVAL_STATUS_REJECTED)
      ]
    ).freeze

    APPROVALS_CLOSURE_APPROVED = QueriedIndicator.new(
      name: 'approval_closure_approved',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_closure', value: Approval::APPROVAL_STATUS_APPROVED)
      ]
    ).freeze

    TASKS_OVERDUE_ASSESSMENT = FacetedIndicator.new(
      name: 'tasks_overdue_assessment',
      facet: 'associated_user_names',
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::DateRange.new(
          field_name: 'assessment_due_dates', from: FacetedIndicator.dawn_of_time, to: FacetedIndicator.present
        )
      ]
    ).freeze

    TASKS_OVERDUE_CASE_PLAN = FacetedIndicator.new(
      name: 'tasks_overdue_case_plan',
      facet: 'associated_user_names',
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::DateRange.new(
          field_name: 'case_plan_due_dates', from: FacetedIndicator.dawn_of_time, to: FacetedIndicator.present
        )
      ]
    ).freeze

    TASKS_OVERDUE_SERVICES = FacetedIndicator.new(
      name: 'tasks_overdue_services',
      facet: 'associated_user_names',
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::DateRange.new(
          field_name: 'service_due_dates', from: FacetedIndicator.dawn_of_time, to: FacetedIndicator.present
        )
      ]
    ).freeze

    TASKS_OVERDUE_FOLLOWUPS = FacetedIndicator.new(
      name: 'tasks_overdue_followups',
      facet: 'associated_user_names',
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::DateRange.new(
          field_name: 'followup_due_dates', from: FacetedIndicator.dawn_of_time, to: FacetedIndicator.present
        )
      ]
    ).freeze

    PROTECTION_CONCERNS_OPEN_CASES = FacetedIndicator.new(
      name: 'protection_concerns_open_cases',
      facet: 'protection_concerns',
      record_model: Child,
      scope: OPEN_ENABLED
    ).freeze

    PROTECTION_CONCERNS_NEW_THIS_WEEK = FacetedIndicator.new(
      name: 'protection_concerns_new_this_week',
      facet: 'protection_concerns',
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::DateRange.new({ field_name: 'created_at' }.merge(FacetedIndicator.this_week))
      ]
    ).freeze

    PROTECTION_CONCERNS_ALL_CASES = FacetedIndicator.new(
      name: 'protection_concerns_all_cases',
      facet: 'protection_concerns',
      record_model: Child,
      scope: [SearchFilters::Value.new(field_name: 'record_state', value: true)]
    ).freeze

    PROTECTION_CONCERNS_CLOSED_THIS_WEEK = FacetedIndicator.new(
      name: 'protection_concerns_closed_this_week',
      facet: 'protection_concerns',
      record_model: Child,
      scope: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_CLOSED),
        SearchFilters::DateRange.new({ field_name: 'date_closure' }.merge(FacetedIndicator.this_week))
      ]
    ).freeze

    SHARED_WITH_OTHERS_REFERRALS = QueriedIndicator.new(
      name: 'shared_with_others_referrals',
      record_model: Child,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'referred_users_present', value: true)
      ],
      scope_to_owner: true
    ).freeze

    SHARED_WITH_OTHERS_PENDING_TRANSFERS = QueriedIndicator.new(
      name: 'shared_with_others_pending_transfers',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'transfer_status', value: Transition::STATUS_INPROGRESS)
      ]
    ).freeze

    SHARED_WITH_OTHERS_REJECTED_TRANSFERS = QueriedIndicator.new(
      name: 'shared_with_others_rejected_transfers',
      record_model: Child,
      scope_to_owner: true,
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'transfer_status', value: Transition::STATUS_REJECTED)
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
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'not_edited_by_owner', value: true)
      ],
      scope_to_referred: true
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

    SHARED_FROM_MY_TEAM_REFERRALS = FacetedIndicator.new(
      name: 'shared_from_my_team_referrals',
      facet: 'owned_by',
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'referred_users_present', value: true)
      ],
      scope_to_owned_by_groups: true
    ).freeze

    SHARED_FROM_MY_TEAM_PENDING_TRANSFERS = FacetedIndicator.new(
      name: 'shared_from_my_team_pending_transfers',
      facet: 'owned_by',
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'transfer_status', value: Transition::STATUS_INPROGRESS)
      ],
      scope_to_owned_by_groups: true
    ).freeze

    SHARED_FROM_MY_TEAM_REJECTED_TRANSFERS = FacetedIndicator.new(
      name: 'shared_from_my_team_rejected_transfers',
      facet: 'owned_by',
      record_model: Child,
      scope: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'transfer_status', value: Transition::STATUS_REJECTED)
      ],
      scope_to_owned_by_groups: true
    ).freeze

    SHARED_WITH_MY_TEAM_REFERRALS = FacetedIndicator.new(
      name: 'shared_with_my_team_referrals',
      record_model: Child,
      facet: 'referred_users',
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'referred_users_present', value: true)
      ]
    ).freeze

    SHARED_WITH_MY_TEAM_PENDING_TRANSFERS = FacetedIndicator.new(
      name: 'shared_with_my_team_pending_transfers',
      record_model: Child,
      facet: 'transferred_to_users',
      queries: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'transfer_status', value: Transition::STATUS_INPROGRESS)
      ]
    ).freeze

    def self.reporting_location_indicators
      reporting_location_config = SystemSettings.current.reporting_location_config
      admin_level = reporting_location_config&.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL
      field_key = reporting_location_config&.field_key || ReportingLocation::DEFAULT_FIELD_KEY
      facet_name = "#{field_key}#{admin_level}"

      [
        FacetedIndicator.new(
          name: 'reporting_location_open',
          facet: facet_name,
          record_model: Child,
          scope: OPEN_ENABLED
        ).freeze,
        FacetedIndicator.new(
          name: 'reporting_location_open_last_week',
          facet: facet_name,
          record_model: Child,
          scope: OPEN_ENABLED + [
            SearchFilters::DateRange.new({ field_name: 'created_at' }.merge(FacetedIndicator.last_week))
          ]
        ).freeze,
        FacetedIndicator.new(
          name: 'reporting_location_open_this_week',
          facet: facet_name,
          record_model: Child,
          scope: OPEN_ENABLED + [
            SearchFilters::DateRange.new({ field_name: 'created_at' }.merge(FacetedIndicator.this_week))
          ]
        ).freeze,
        FacetedIndicator.new(
          name: 'reporting_location_closed_last_week',
          facet: facet_name,
          record_model: Child,
          scope: CLOSED_ENABLED + [
            SearchFilters::DateRange.new({ field_name: 'created_at' }.merge(FacetedIndicator.last_week))
          ]
        ).freeze,
        FacetedIndicator.new(
          name: 'reporting_location_closed_this_week',
          facet: facet_name,
          record_model: Child,
          scope: CLOSED_ENABLED + [
            SearchFilters::DateRange.new({ field_name: 'created_at' }.merge(FacetedIndicator.this_week))
          ]
        ).freeze
      ]
    end
  end
end
