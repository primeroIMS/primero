module KPI
  class ClientSatisfactionRate < Search
    def search
      Child.search do
        with :created_at, from..to

        any_of do
          with :satisfaction_status, 'satisfied'
          with :satisfaction_status, 'unsatisfied'
        end

        facet :satisfaction_status, only: 'satisfied'
      end
    end
  end
end
