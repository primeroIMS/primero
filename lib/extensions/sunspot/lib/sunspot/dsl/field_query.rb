module Sunspot
  module DSL
    class FieldQuery
      def pivot(*field_names, **options)
        fields = field_names.map { |f| @setup.field(f) }
        pivot = Sunspot::Query::PivotFacet.new(fields, options)
        @query.add_field_facet(pivot)
        @search.add_pivot_facet(fields, options)
      end
    end
  end
end
