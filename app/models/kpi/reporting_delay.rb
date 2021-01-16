# frozen_string_literal: true

# ReportingDelay Search
#
# For incidents created in a given range of moneths, looks at the
# difference between when an incident was first reported and when
# the incident actually happened. This is aggregated into 6 time ranges.
class Kpi::ReportingDelay < Kpi::BucketedSearch
  search_model Incident
  restricted_field :reporting_delay_days

  def buckets
    [
      { key: '0-3days', u: 3 },
      { key: '4-5days', l: 4, u: 5 },
      { key: '6-14days', l: 6, u: 14 },
      { key: '15-30days', l: 15, u: 30 },
      { key: '1-3months', l: 31, u: 90 },
      { key: '4months', l: 91 }
    ]
  end

  def data
    @data = search.facet_response
                  .dig('facet_intervals', restricted_field.indexed_name)
                  .map do |delay, count|
      {
        delay: delay,
        total_incidents: count,
        percentage: count.to_f / search.total
      }
    end
  end

  def to_json(*_args)
    { data: data }
  end
end
