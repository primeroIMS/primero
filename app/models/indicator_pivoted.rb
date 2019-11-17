class IndicatorPivoted < Indicator
  attr_accessor :pivots

  def query(sunspot)
    this = self
    sunspot.instance_eval do
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
    facet_pivot = field_name_solr_map.map { |solr_field, _| solr_field }
    sunspot_search.facet_response['facet_pivot'][facet_pivot.join(',')].each do |row|
      stats[row['value']] = row['pivot'].map do |pivot|
        stat = {
          'count' => pivot['count'],
          'query' => stat_query_strings([row, pivot])
        }
        [pivot['value'], stat]
      end.to_h
    end
    stats
  end

  def stat_query_strings(row_pivot)
    row, pivot = row_pivot
    scope_query_strings + [
      "#{field_name_solr_map[row['field']]}=#{row['value']}",
      "#{field_name_solr_map[pivot['field']]}=#{pivot['value']}"
    ]
  end

  private

  def field_name_solr_map
    @field_name_solr_map ||= pivots.map do |pivot|
      [SolrUtils.indexed_field_name(record_model, pivot), pivot]
    end.to_h
  end

end