module Indicators
  class Case
    OPEN_ENABLED = [
      SearchFilters::Value.new(field_name: 'record_state', value: true),
      SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN)
    ].freeze

    OPEN = QueriedIndicator.new(
      name: 'open',
      record_model: Child,
      search_filters: OPEN_ENABLED,
      scope_to_owner: true
    ).freeze

    #NEW = TODO: Cases that have just been assigned to me. Need extra work.

    UPDATED = QueriedIndicator.new(
      name: 'updated',
      record_model: Child,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'not_edited_by_owner', value: true)
      ],
      scope_to_owner: true
    ).freeze

    CLOSED_RECENTLY = QueriedIndicator.new(
      name: 'closed_recently',
      record_model: Child,
      search_filters: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_CLOSED),
        SearchFilters::DateRange.new(field_name: 'date_closure', from: QueriedIndicator.recent_past, to: QueriedIndicator.present)
      ],
      scope_to_owner: true
    ).freeze

    WORKFLOW = FacetedIndicator.new(
      name: 'workflow',
      facet: 'workflow',
      record_model: Child,
      scope: OPEN_ENABLED,
      scope_to_owner: true
    ).freeze

    WORKFLOW_TEAM = PivotedIndicator.new(
      name: 'workflow_team',
      record_model: Child,
      pivots: %w[owned_by workflow],
      scope: OPEN_ENABLED
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
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_bia', value: Child::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_ASSESSMENT_PENDING_GROUP = QueriedIndicator.new(
      name: 'approval_assessment_pending_group',
      record_model: Child,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_bia', value: Child::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_ASSESSMENT_REJECTED = QueriedIndicator.new(
      name: 'approval_assessment_rejected',
      record_model: Child,
      scope_to_owner: true,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_bia', value: Child::APPROVAL_STATUS_REJECTED)
      ]
    ).freeze

    APPROVALS_ASSESSMENT_APPROVED = QueriedIndicator.new(
      name: 'approval_assessment_approved',
      record_model: Child,
      scope_to_owner: true,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_bia', value: Child::APPROVAL_STATUS_APPROVED)
      ]
    ).freeze

    APPROVALS_CASE_PLAN_PENDING = QueriedIndicator.new(
      name: 'approval_case_plan_pending',
      record_model: Child,
      scope_to_owner: true,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_case_plan', value: Child::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_CASE_PLAN_PENDING_GROUP = QueriedIndicator.new(
      name: 'approval_case_plan_pending_group',
      record_model: Child,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_case_plan', value: Child::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_CASE_PLAN_REJECTED = QueriedIndicator.new(
      name: 'approval_case_plan_rejected',
      record_model: Child,
      scope_to_owner: true,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_case_plan', value: Child::APPROVAL_STATUS_REJECTED)
      ]
    ).freeze

    APPROVALS_CASE_PLAN_APPROVED = QueriedIndicator.new(
      name: 'approval_case_plan_approved',
      record_model: Child,
      scope_to_owner: true,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_case_plan', value: Child::APPROVAL_STATUS_APPROVED)
      ]
    ).freeze

    APPROVALS_CLOSURE_PENDING = QueriedIndicator.new(
      name: 'approval_closure_pending',
      record_model: Child,
      scope_to_owner: true,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_closure', value: Child::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_CLOSURE_PENDING_GROUP = QueriedIndicator.new(
      name: 'approval_closure_pending_group',
      record_model: Child,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_closure', value: Child::APPROVAL_STATUS_PENDING)
      ]
    ).freeze

    APPROVALS_CLOSURE_REJECTED = QueriedIndicator.new(
      name: 'approval_closure_rejected',
      record_model: Child,
      scope_to_owner: true,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_closure', value: Child::APPROVAL_STATUS_REJECTED)
      ]
    ).freeze

    APPROVALS_CLOSURE_APPROVED = QueriedIndicator.new(
      name: 'approval_closure_approved',
      record_model: Child,
      scope_to_owner: true,
      search_filters: OPEN_ENABLED + [
        SearchFilters::Value.new(field_name: 'approval_status_closure', value: Child::APPROVAL_STATUS_APPROVED)
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

  end
end