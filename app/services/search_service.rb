class SearchService

  def self.search(record_class, filters=[], query_scope=[], query=nil, sort={created_at: :desc}, pagination={})
    record_class.search do
      filters.each do |filter|
        filter.query_scope(self)
      end

      if query_scope.present?
        if query_scope.is_a?(User)
          with(:associated_user_names, query_scope.user_name)
        elsif query_scope.is_a?(Array)
          group_ids = query_scope.map(&:id).compact
          with(:owned_by_groups).any_of(group_ids)
        end
      end

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

end