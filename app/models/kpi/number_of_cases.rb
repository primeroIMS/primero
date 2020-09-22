module KPI
  # NumberOfCases Search
  #
  # Looks for all of the cases created in a given location over a range
  # of months.
  class NumberOfCases < PivotedRangeSearch
    search_model Child
    range_field :created_at
    pivot_field :owned_by_location

    def to_json
      { dates: columns, data: data }
    end
  end
end
