# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Abstract Class for Indicator
  class AbstractIndicator < ValueObject
    # If you define a new scope make sure you update the method group_indicators_by_scope
    # from the IndicatorQueryService.
    # Indicator Scopes
    # scope: A query to constraint the results specially for Faceted and Pivoted indicators.
    # scope_to_owner: Records where the user is the owner.
    # scope_to_referred: Records where the user is referred.
    # scope_to_transferred: Records where the user is transferred.
    # scope_to_not_last_update: Records where the user was not last to update.
    # scope_to_transferred_groups: Records transferred to the user's user group.
    # exclude_zeros: Do not include result with zeroes.
    # scope_to_user: Constraints the resuls to the user_query_scope. Userful for Faceted and Pivoted indicators.
    # rubocop:enable Style/ClassAndModuleChildren
    attr_accessor :name, :record_model, :scope, :scope_to_owner, :scope_to_referred,
                  :scope_to_transferred, :scope_to_not_last_update, :scope_to_owned_by_groups,
                  :scope_to_transferred_groups, :exclude_zeros, :scope_to_user

    class << self
      def type
        'indicator'
      end
    end

    def query(_)
      raise NotImplementedError
    end

    def facet_name
      name
    end

    def stat_query_strings(_, _, _)
      raise NotImplementedError
    end

    protected

    def query_scope(user)
      with_scope_to_owner(user) +
        with_scope_to_owned_by_groups(user) +
        with_scope_to_not_last_update(user) +
        with_scope_referred_to_users(user) +
        with_scope_transferred_to_users(user) +
        with_scope_transferred_to_user_groups(user)
    end

    def with_scope_to_owner(user)
      return [] unless scope_to_owner

      [SearchFilters::TextValue.new(field_name: 'owned_by', value: user.user_name)]
    end

    def with_scope_to_owned_by_groups(user)
      return [] unless scope_to_owned_by_groups

      [SearchFilters::ValueList.new(field_name: 'owned_by_groups', value: user.user_group_unique_ids)]
    end

    def with_scope_to_not_last_update(user)
      return [] unless scope_to_not_last_update

      [SearchFilters::TextValue.new(field_name: 'last_updated_by', value: user.user_name, not_filter: true)]
    end

    def with_scope_referred_to_users(user)
      return [] unless scope_to_referred

      [SearchFilters::ReferredUsers.new(value: user.user_name, record_type: record_model.name)]
    end

    def with_scope_transferred_to_users(user)
      return [] unless scope_to_transferred

      [SearchFilters::TransferredToUsers.new(value: user.user_name, record_type: record_model.name)]
    end

    def with_scope_transferred_to_user_groups(user)
      return [] unless scope_to_transferred_groups

      [
        SearchFilters::TransferredToUserGroups.new(
          values: user.user_group_unique_ids, type: Transfer.name, record_type: record_model.name
        )
      ]
    end

    def scope_query_strings
      scope&.map(&:to_s) || []
    end
  end
end
