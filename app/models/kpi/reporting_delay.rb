module KPI
  # ReportingDelay Search
  #
  # For incidents created in a given range of moneths, looks at the
  # difference between when an incident was first reported and when
  # the incident actually happened. This is aggregated into 6 time ranges.
  class ReportingDelay < BucketedSearch
    search_model Incident
    restricted_field :date_of_first_report
    compared_field :incident_date_derived

    def buckets
      [
        { key: '0-3days', u: days(3) },
        { key: '4-5days', l: days(3) + 1, u: days(5) },
        { key: '6-14days', l: days(5) + 1, u: days(14) },
        { key: '15-30days', l: days(14) + 1, u: days(30) },
        { key: '1-3months', l: days(30) + 1, u: months(3) },
        { key: '4months', l: months(3) + 1 }
      ]
    end

    def data
      @data = search.facet_response['facet_queries'].map do |delay, number_of_incidents|
        {
          delay: delay,
          total_incidents: number_of_incidents,
          percentage: number_of_incidents.to_f / search.total
        }
      end
    end

    def to_json
      { data: data }
    end
  end
end
