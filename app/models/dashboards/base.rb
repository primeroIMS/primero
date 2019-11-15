module Dashboards
  class Base

    def id
      self.class.name.underscore
    end

    def record_model
      raise NotImplementedError
    end

    def indicators
      raise NotImplementedError
    end

    def query
      record_model.search do
        #TODO: set scope: user and module
        indicators.each do |indicator|
          facet(indicator.name, zeros: true) do
            row(:value) do
              indicator.search_filters.each { |f| f.query_scope(self) }
            end
          end
        end
      end
    end

    def stats
      query.facets.map do |facet|
        [facet.name, facet.rows[0].count]
      end.to_h
    end

  end
end