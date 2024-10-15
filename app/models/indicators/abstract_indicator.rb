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
    # rubocop:enable Style/ClassAndModuleChildren
    attr_accessor :name, :record_model, :scope, :scope_to_owner, :scope_to_referred,
                  :scope_to_transferred, :scope_to_not_last_update, :scope_to_owned_by_groups,
                  :scope_to_transferred_groups

    class << self
      def type
        'indicator'
      end
    end

    def facet_name
      name
    end

    def stat_query_strings(_, _, _)
      raise NotImplementedError
    end

    def stats_for_indicator(user)
      indicator_filters = filters(user)
      user_query_scope = user.record_query_scope(record_model, false)
      managed_user_names = user.admin? ? [] : user.managed_user_names
      write_stats_for_indicator(indicator_filters, user_query_scope, managed_user_names)
    end

    def write_stats_for_indicator(_, _, _)
      raise NotImplementedError
    end

    def query(indicator_filters, user_query_scope)
      Search::SearchQuery.new(record_model).with_filters(indicator_filters).with_scope(user_query_scope).result.records
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

      [SearchFilters::TextList.new(field_name: 'owned_by_groups', values: user.user_group_unique_ids)]
    end

    def with_scope_to_not_last_update(user)
      return [] unless scope_to_not_last_update

      [SearchFilters::TextValue.new(field_name: 'last_updated_by', value: user.user_name, not_filter: true)]
    end

    def with_scope_referred_to_users(user)
      return [] unless scope_to_referred

      [SearchFilters::TextValue.new(field_name: 'referred_users', value: user.user_name)]
    end

    def with_scope_transferred_to_users(user)
      return [] unless scope_to_transferred

      [SearchFilters::TextValue.new(field_name: 'transferred_to_users', value: user.user_name)]
    end

    def with_scope_transferred_to_user_groups(user)
      return [] unless scope_to_transferred_groups

      [SearchFilters::TextList.new(field_name: 'transferred_to_user_groups', values: user.user_group_unique_ids)]
    end

    def filters(user)
      query_scope(user) + scope
    end

    def scope_query_strings
      scope&.map(&:to_s) || []
    end
  end
end
