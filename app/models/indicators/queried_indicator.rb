module Indicators
  class QueriedIndicator < FacetedIndicator
    attr_accessor :search_filters

    def self.recent_past
      Time.zone.now - 10.days
    end

    def self.present
      Time.zone.now
    end

    def query(sunspot, user)
      this = self
      sunspot.instance_eval do
        with(:owned_by, user.user_name) if this.scope_to_owner
        this.scope&.each { |f| f.query_scope(self) }
        facet(this.name, zeros: true) do
          row(this.name) do
            this.search_filters.each { |f| f.query_scope(self) }
          end
        end
      end
    end

    def stat_query_strings(_, owner)
      scope_query_strings +
        owner_query_string(owner) +
        (search_filters&.map(&:to_s) || [])
    end

  end
end