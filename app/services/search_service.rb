# frozen_string_literal: true

# Query for records using Sunspot Solr
class SearchService
  class << self
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # Query for records using Sunspot Solr.
    # record_class: The class of the type of record queried for.
    # search_params: A hash of search options used to build the query.
    #   filters: A hash where the key is the field_name, and value an expected value. See SearchFilterService
    #   query: A text query
    #   query_scope: A hash with user scope and module scope.
    #                eg. { user: { user: 'u', agency: 'a', group: 'g'}, module: 'primeromodule-cp' } }
    #   sort: A hash indicating the field to sort by and the direction. eg { created_at: :desc }
    #   paginattion: A hash indicating the pagination
    def search(record_class, search_params = {})
      params = with_defaults(search_params)
      params = with_location_filters(record_class, params)
      record_class.search do
        params[:filters].each { |filter| filter.query_scope(self) }
        with_query_scope(self, params[:query_scope])
        with_query(self, record_class, params[:query])

        params[:sort].each do |sort_field, order|
          order_by(selected_sort_field(record_class, sort_field), order)
        end
        paginate(params[:pagination])
      end
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    def with_location_filters(record_class, params)
      params.tap do |p|
        p[:filters] = p[:filters].map { |filter| filter.as_location_filter(record_class) }
      end
    end

    def selected_sort_field(record_class, sort_field)
      if record_class.sortable_text_fields.present? && record_class.sortable_text_fields.include?(sort_field.to_s)
        "#{sort_field}_sortable".to_sym
      else
        sort_field
      end
    end

    def with_defaults(search_params)
      {
        filters: [], query_scope: {},
        sort: { created_at: :desc },
        pagination: {}
      }.merge(search_params)
    end

    def with_query(sunspot, record_class, query)
      return unless query&.strip&.present?

      sunspot.instance_eval do
        fulltext(query.strip) do
          # In schema.xml defaultOperator is "AND"
          # the following changes that behavior to match on
          # any of the search terms instead all of them.
          minimum_match(1)
          fields(*record_class.quicksearch_fields)
        end
      end
    end

    def with_query_scope(sunspot, query_scope)
      with_user_scope(sunspot, query_scope[:user])
      with_module_scope(sunspot, query_scope[:module])
    end

    def with_user_scope(sunspot, user_scope)
      return unless user_scope.present?

      sunspot.instance_eval do
        if user_scope['user'].present?
          with(:associated_user_names, user_scope['user'])
        elsif user_scope['agency'].present?
          with(:associated_user_agencies, user_scope['agency'])
        elsif user_scope['group'].present?
          with(:associated_user_groups, user_scope['group'])
        end
      end
    end

    def with_module_scope(sunspot, module_scope)
      return unless module_scope.present?

      sunspot.instance_eval do
        with(:module_id, module_scope)
      end
    end
  end
end
