module KPI
  # PivotedRangeSearch
  #
  # Extract the logic for a common form of search involving a range,
  # usually of dates and a pivoted field for counting occurances within
  # those dates.
  class PivotedRangeSearch < KPI::Search
    class <<self
      def range_field(field = nil)
        @range_field ||= field
      end

      def pivot_field(field = nil)
        @pivot_field ||= field
      end
    end

    def range_field
      SolrUtils.sunspot_setup(search_model).field(self.class.range_field)
    end

    def pivot_field
      SolrUtils.sunspot_setup(search_model).field(self.class.pivot_field)
    end

    # Shortening this method (or the others below) would either:
    #
    # 1. Require an arbitrary breaking up of the solr query into methods
    #    which arguably add little to no explanatory or architectural value
    #    to the code base.
    # 2. Require re-achitecting the solution to invert the responcibilities
    #    of defining a search so that individual aspects of the search
    #    would be defined in methods and later combined together into a
    #    whole search by some evaluation method. It feels wrong to drive
    #    that sort of architectural decisions for linting reasons alone.
    #
    # rubocop:disable Metrics/MethodLength
    def search
      @search ||= search_model.search do
        adjust_solr_params do |params|
          params.merge!(
            'facet': true,
            'facet.range': "{!tag=range}#{range_field.indexed_name}",
            'facet.range.start': from,
            'facet.range.end': to,
            'facet.range.gap': '+1MONTH',
            'facet.pivot': [
              "{!range=range}#{pivot_field.indexed_name}"
            ]
          )
        end

        paginate page: 1, per_page: 0
      end
    end
    # rubocop:enable Metrics/MethodLength

    def columns
      @columns ||= search.facet_response
        .dig('facet_ranges', range_field.indexed_name, 'counts')
        .each_cons(2)
        .map(&:first)
    end

    def data
      @data ||= pivot_range_counts.map do |value, counts|
        placename = Location.find_by(location_code: value.upcase)
          .placename

        { reporting_site: placename }.merge(counts)
      end
    end

    private

    def pivot_range_counts
      search.facet_response
        .dig('facet_pivot', pivot_field.indexed_name)
        .map do |record|
        [record['value'],
         record
          .dig('ranges', range_field.indexed_name, 'counts')
          .each_cons(2)
          .to_h]
      end.to_h
    end
  end
end
