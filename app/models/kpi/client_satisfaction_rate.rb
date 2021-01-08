# frozen_string_literal: true

# ClientSatisfactionRate
#
# A KPI to track, of all client feedback forms filled out, what percentages
# are satisfied?
class KPI::ClientSatisfactionRate < KPI::Search
  def search
    Child.search do
      with :owned_by_agency_id, owned_by_agency_id
      with :created_at, from..to
      with :owned_by_groups, owned_by_groups

      any_of do
        with :satisfaction_status, 'satisfied'
        with :satisfaction_status, 'unsatisfied'
      end

      facet :satisfaction_status, only: 'satisfied'
    end
  end

  def to_json(*_args)
    {
      data: {
        satisfaction_rate: nan_safe_divide(
          search.facet(:satisfaction_status).rows.first&.count || 0,
          search.total
        )
      }
    }
  end
end
