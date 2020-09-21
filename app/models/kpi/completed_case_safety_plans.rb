module KPI
  class CompletedCaseSafetyPlans < Search
    def search
      Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        facet :completed_safety_plan, only: true
      end
    end
  end
end
