class IndicatorQueryService

  class << self

    def query(indicators, user)
      result = {}
      group_indicators(indicators).each do |record_model, record_indicators|
        record_type = record_model.parent_form
        result[record_type] = stats(record_query(record_model, record_indicators, user))
      end
      result
    end

    private

    def record_query(record_model, indicators, user)
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

    def stats(search)
      search.facets.map do |facet|
        [facet.name, facet.rows[0].count]
      end.to_h
    end

    def group_indicators(indicators)
      indicators.group_by(&:record_model)
    end

  end

end