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
    facet_pivot = pivots.map { |p| SolrUtils.indexed_field_name(record_model, p) }
    sunspot_search.facet_response['facet_pivot'][facet_pivot.join(',')].each do |row|
      stats[row['value']] = row['pivot'].map { |p| [p['value'], p['count']] }.to_h
    end
    stats
  end

end