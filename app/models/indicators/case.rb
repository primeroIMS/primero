module Indicators
  class Case

    OPEN = IndicatorQueried.new(
      name: 'open',
      record_model: Child,
      search_filters: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN)
      ]
    ).freeze

    #NEW = TODO: Cases that have just been assigned to me. Need extra work.

    UPDATED = IndicatorQueried.new(
      name: 'updated',
      record_model: Child,
      search_filters: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN),
        SearchFilters::Value.new(field_name: 'not_edited_by_owner', value: true)
      ]
    ).freeze

    CLOSED_RECENTLY = IndicatorQueried.new(
      name: 'closed_recently',
      record_model: Child,
      search_filters: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_CLOSED),
        SearchFilters::DateRange.new(field_name: 'date_closure', from: IndicatorQueried.recent_past, to: IndicatorQueried.present)
      ]
    ).freeze

    WORKFLOW = Indicator.new(
      name: 'workflow',
      record_model: Child,
      scope: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN)
      ]
    ).freeze

    WORKFLOW_TEAM = IndicatorPivoted.new(
      name: 'workflow_team',
      record_model: Child,
      pivots: %w[owned_by workflow],
      scope: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN)
      ]
    )

  end
end