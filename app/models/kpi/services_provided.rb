module KPI
  class ServicesProvided < Search
    def search
      @search ||= Child.search do
        with :created_at, from..to

        facet :services_provided
      end
    end

    def data
      @data ||= search.facet(:services_provided).rows.map do |row|
        {
          service: Lookup.display_value('lookup-service-type', row.value),
          count: row.count
        }
      end
    end

    def to_json
       { data: { services_provided: data } }
    end
  end
end
