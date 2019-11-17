class Indicator < ValueObject
  attr_accessor :name, :record_model, :scope

  def query(sunspot)
    this = self
    sunspot.instance_eval do
      this.scope&.each { |f| f.query_scope(self) }
      facet(this.name, zeros: true)
    end
  end

  def stats_from_search(sunspot_search)
    sunspot_search.facet(name).rows.map do |row|
      stat = {
        'count' => row.count,
        'query' => stat_query_strings(row)
      }
      [row.value, stat]
    end.to_h
  end

  def stat_query_strings(facet_row)
    scope_query_strings + ["#{name}=#{facet_row.value}"]
  end

  protected

  def scope_query_strings
    scope&.map(&:to_s) || []
  end

end