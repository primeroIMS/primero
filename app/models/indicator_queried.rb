class IndicatorQueried < Indicator
  attr_accessor :search_filters

  def self.recent_past
    Time.zone.now - 10.days
  end

  def self.present
    Time.zone.now
  end

  def query(sunspot)
    this = self
    sunspot.instance_eval do
      this.scope&.each { |f| f.query_scope(self) }
      facet(this.name, zeros: true) do
        row(this.name) do
          this.search_filters.each { |f| f.query_scope(self) }
        end
      end
    end
  end
end