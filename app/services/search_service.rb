class SearchService

  class << self

    def search(record_class, filters=[], query_scope=[], query=nil, sort={created_at: :desc}, pagination={})
      record_class.search do
        filters.each do |filter|
          filter.query_scope(self)
        end

        with_query_scope(self, query_scope)

        if query.present?
          fulltext(query.strip) do
            #In schema.xml defaultOperator is "AND"
            #the following change that behavior to match on
            #any of the search terms instead all of them.
            minimum_match(1)
            fields(*record_class.quicksearch_fields)
          end
        end

        sort.each {|sort_field, order| order_by(sort_field, order)}
        paginate(pagination)
      end
    end


    def with_query_scope(sunspot, query_scope)
      return unless query_scope.present?

      sunspot.instance_eval do
        if query_scope.is_a?(User)
          with(:associated_user_names, query_scope.user_name)
        elsif query_scope.is_a?(Hash)
          if query_scope[Permission::AGENCY].present?
            with(:associated_user_agencies, query_scope[Permission::AGENCY])
          else
            with(:associated_user_groups, query_scope[Permission::GROUP])
          end
        end
      end
    end

  end

end