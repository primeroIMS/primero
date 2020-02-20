module Sunspot
  module Search
    # Modify AbstractSearch to support pivots
    class AbstractSearch
      def initialize(connection, setup, query, configuration) #:nodoc:
        @connection, @setup, @query = connection, setup, query
        @query.paginate(1, configuration.pagination.default_per_page)

        @facets_by_name = {}
        @facets = []

        @groups_by_name = {}
        @groups = []

        @stats_by_name = {}
        @stats = []

        @pivots_by_name = {}
        @pivots = []
      end

      def add_pivot_facet(fields, options)
        # pivots are named after their fields joined by commas, see:
        # https://lucene.apache.org/solr/guide/6_6/faceting.html#Faceting-CombiningFacetQueriesAndFacetRangesWithPivotFacets
        pivot_name = fields.map(&:name).join(',')
        pivot = Sunspot::Search::PivotFacet.new(fields, @setup, self, options)
        @pivots << pivot
        @pivots_by_name[pivot_name] = pivot
      end

      def pivot(*names)
        return if names.empty?
        # Ordering of names is important!
        @pivots_by_name[names.join(',')]
      end
    end
  end
end
