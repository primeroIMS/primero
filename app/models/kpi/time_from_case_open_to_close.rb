module KPI
  # TimeFromCaseOpenToClose Search
  #
  # For cases created between a given range of months, looks at the
  # difference in time between when a case was created and when it was
  # closed. This is aggregated into 4 bins.
  class TimeFromCaseOpenToClose < BucketedSearch
    search_model Child
    restricted_field :date_closure
    compared_field :created_at

    def buckets
      [
        { key: '1-month', u: months(1) },
        { key: '1-3months', l: months(1) + 1, u: months(3) },
        { key: '3-6months', l: months(3) + 1, u: months(6) },
        { key: '7-months', l: months(6) + 1 }
      ]
    end

    def data
      @data ||= search.facet_response['facet_queries']
        .map do |delay, total_cases|
        {
          time: delay,
          percent: total_cases.to_f / search.total
        }
      end
    end

    def to_json
      { data: data }
    end
  end
end
