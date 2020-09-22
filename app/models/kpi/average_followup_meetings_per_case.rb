module KPI
  class AverageFollowupMeetingsPerCase < Search
    def search
      search = Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        stats :number_of_meetings
      end
    end

    def to_json
      { data: { average_meetings: search.stats(:number_of_meetings).mean || 0 } }
    end
  end
end
