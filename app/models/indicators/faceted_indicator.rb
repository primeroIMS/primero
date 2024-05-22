# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Class for Faceted Indicator
  class FacetedIndicator < AbstractIndicator
    # rubocop:enable Style/ClassAndModuleChildren
    attr_accessor :facet

    def facet_name
      facet
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/PerceivedComplexity
    def query(sunspot, user)
      this = self
      sunspot.instance_eval do
        with(:owned_by, user.user_name) if this.scope_to_owner
        with(:referred_users, user.user_name) if this.scope_to_referred
        with(:transferred_to_users, user.user_name) if this.scope_to_transferred
        with(:transferred_to_user_groups, user.user_group_unique_ids) if this.scope_to_transferred_groups
        # TODO: Add agency user scope
        with(:owned_by_groups, user.user_group_unique_ids) if this.scope_to_owned_by_groups
        without(:last_updated_by, user.user_name) if this.scope_to_not_last_update
        this.scope&.each { |f| f.query_scope(self) }
        facet(this.facet_name, zeros: !this.exclude_zeros)
      end
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/PerceivedComplexity

    def stat_query_strings(facet_row, owner, user)
      scope_query_strings +
        owner_query_string(owner) +
        referred_query_string(user) +
        transferred_query_string(user) +
        transferred_groups_query_string(user) +
        owned_by_groups_query_string(user) +
        not_last_updated_query_string(user) +
        ["#{facet_name}=#{facet_row.value}"]
    end
  end
end
