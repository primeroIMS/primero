# frozen_string_literal: true

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
        with(:referred_users, user.user_name) if this.scope_to_referred
        with(:transferred_to_users, user.user_name) if this.scope_to_transferred
        this.scope&.each { |f| f.query_scope(self) }
        facet(this.facet_name, zeros: true)
      end
    end

    def stat_query_strings(facet_row, owner, user = nil)
      scope_query_strings +
        owner_query_string(owner) +
        referred_query_string(user) +
        transferred_query_string(user) +
        ["#{facet_name}=#{facet_row.value}"]
    end
  end
end
