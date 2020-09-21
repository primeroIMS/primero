module KPI
  class AssessmentStatus < Search
    def search
      Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        facet :completed_survivor_assessment, only: true
      end
    end
  end
end
