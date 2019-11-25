module Indicators
  class FacetedIndicator < AbstractIndicator
    attr_accessor :facet

    def facet_name
      facet
    end

    def query(sunspot, user)
      this = self
      sunspot.instance_eval do
        with(:owned_by, user.user_name) if this.scope_to_owner
        this.scope&.each { |f| f.query_scope(self) }
        facet(this.facet_name, zeros: true)
      end
    end

    def stat_query_strings(facet_row, owner)
      scope_query_strings +
        owner_query_string(owner) +
        ["#{facet_name}=#{facet_row.value}"]
    end

  end
end