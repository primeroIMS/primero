module Dashboards
  class CaseWorker < Base

    OPEN = Indicator.new(
      name: 'open',
      search_filters: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN)
      ]
    )

    #NEW = TODO: Cases that have just been assigned to me. Need

    UPDATED = Indicator.new(
      name: 'updated',
      search_filters: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_OPEN),
        SearchFilters::Value.new(field_name: 'not_edited_by_owner', value: true)
      ]
    )

    CLOSED_RECENTLY = Indicator.new(
      name: 'closed_recently',
      search_filters: [
        SearchFilters::Value.new(field_name: 'record_state', value: true),
        SearchFilters::Value.new(field_name: 'status', value: Record::STATUS_CLOSED),
        SearchFilters::DateRange.new(field_name: 'date_closure', from: Indicator.recent_past, to: Indicator.present)
      ]
    )

    def record_model
      Child
    end

    def indicators
      [OPEN, UPDATED, CLOSED_RECENTLY]
    end

  end
end