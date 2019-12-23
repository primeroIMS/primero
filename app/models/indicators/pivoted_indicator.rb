module Indicators
  class PivotedIndicator < AbstractIndicator
    attr_accessor :pivots

    def self.type
      'pivoted_indicator'
    end

    def query(sunspot, user)
      this = self
      sunspot.instance_eval do
        with(:owned_by, user.user_name) if this.scope_to_owner
        this.scope&.each { |f| f.query_scope(self) }
        adjust_solr_params do |params|
          params['facet'] = 'true'
          params['facet.missing'] = 'true'
          params['facet.pivot'] = this.pivots.map do |pivot|
            SolrUtils.indexed_field_name('case', pivot)
          end.join(',')
          params['facet.pivot.mincount'] = '-1'
          params['facet.pivot.limit'] = '-1'
        end
      end
    end

    def stats_from_search(sunspot_search)
      stats = {}
      owner = owner_from_search(sunspot_search)
      name_map = field_name_solr_map
      facet_pivot = name_map.keys.join(',')
      sunspot_search.facet_response['facet_pivot'][facet_pivot].each do |row|
        stats[row['value']] = row['pivot'].map do |pivot|
          stat = {
            'count' => pivot['count'],
            'query' => stat_query_strings([row, pivot], owner, name_map)
          }
          [pivot['value'], stat]
        end.to_h
      end
      stats
    end

    def stat_query_strings(row_pivot, owner, name_map = {})
      row, pivot = row_pivot
      scope_query_strings + owner_query_string(owner) + [
        "#{name_map[row['field']]}=#{row['value']}",
        "#{name_map[pivot['field']]}=#{pivot['value']}"
      ]
    end

    private

    def field_name_solr_map
      pivots.map do |pivot|
        [SolrUtils.indexed_field_name(record_model, pivot), pivot]
      end.to_h
    end

  end
end