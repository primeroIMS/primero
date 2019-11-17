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
    sunspot_search.facet(name).rows.map { |r| [r.value, r.count] }.to_h
  end

end