# frozen_string_literal: true

# CompletedCaseActionPlans
#
# A Kpi to track the percentage of cases with a completed case action plan
class Kpi::CompletedCaseActionPlans < Kpi::Search
  def search
    Child.search do
      with :status, Record::STATUS_OPEN
      with :created_at, from..to
      with :owned_by_groups, owned_by_groups
      with :owned_by_agency_id, owned_by_agency_id

      facet :completed_action_plan, only: true
    end
  end

  def to_json(*_args)
    {
      data: {
        completed: nan_safe_divide(
          search.facet(:completed_action_plan).rows.first&.count || 0,
          search.total
        )
      }
    }
  end
end
