module KPI
  class CompletedCaseActionPlans < Search
    def search
      Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        facet :completed_action_plan, only: true
      end
    end

    def to_json
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
end
