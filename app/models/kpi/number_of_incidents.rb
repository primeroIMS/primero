module KPI
  # NumberOfIncidents Search
  #
  # Looks for the number of incidents reported in a given location over
  # a range of months.
  class NumberOfIncidents < PivotedRangeSearch
    search_model Incident
    range_field :created_at
    pivot_field :owned_by_location

    def to_json
      { dates: columns, data: data }
    end
  end
end
