module Indicators
  class Case
    OPEN_ENABLED_FILTERS = [
      SearchFilters::Value.new(field_name: 'record_state', value: true),
      SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN)
    ].freeze

    OPEN = QueriedIndicator.new(
      name: 'open',
      record_model: Child,
      search_filters: OPEN_ENABLED_FILTERS
    ).freeze

    #NEW = TODO: Cases that have just been assigned to me. Need extra work.

    UPDATED = QueriedIndicator.new(
      name: 'updated',
      record_model: Child,
      search_filters: OPEN_ENABLED_FILTERS + [
        SearchFilters::Value.new(field_name: 'not_edited_by_owner', value: true)
      ]
    ).freeze

    CLOSED_RECENTLY = QueriedIndicator.new(
      name: 'closed_recently',
      record_model: Child,
      search_filters: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_CLOSED),
        SearchFilters::DateRange.new(field_name: 'date_closure', from: QueriedIndicator.recent_past, to: QueriedIndicator.present)
      ]
    ).freeze

    WORKFLOW = FacetedIndicator.new(
      name: 'workflow',
      record_model: Child,
      scope: OPEN_ENABLED_FILTERS
    ).freeze

    WORKFLOW_TEAM = PivotedIndicator.new(
      name: 'workflow_team',
      record_model: Child,
      pivots: %w[owned_by workflow],
      scope: OPEN_ENABLED_FILTERS
    )

  end
end