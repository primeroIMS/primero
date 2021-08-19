# frozen_string_literal: true

# TimeFromCaseOpenToClose Search
#
# For cases created between a given range of months, looks at the
# difference in time between when a case was created and when it was
# closed. This is aggregated into 4 bins.
class Kpi::TimeFromCaseOpenToClose < Kpi::BucketedSearch
  search_model Child
  restricted_field :case_lifetime_days

  def buckets
    [
      { key: '1-month', u: 30 },
      { key: '1-3months', l: 31, u: 90 },
      { key: '3-6months', l: 91, u: 180 },
      { key: '7-months', l: 181 }
    ]
  end

  def search
    super do
      without(:case_lifetime_days, nil)
    end
  end

  def data
    @data ||= search.facet_response
                    .dig('facet_intervals', restricted_field.indexed_name)
                    .map do |delay, count|
      {
        time: delay,
        percent: count.to_f / search.total
      }
    end
  end

  def to_json(*_args)
    { data: data }
  end
end
