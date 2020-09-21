module KPI
  class CompletedCaseActionPlans < Search
    def search
      Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        facet :completed_action_plan, only: true
      end
    end
  end
end
