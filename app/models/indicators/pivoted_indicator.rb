# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Class for Pivoted Indicator
  class PivotedIndicator < AbstractIndicator
    # rubocop:enable Style/ClassAndModuleChildren
    attr_accessor :pivots

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
        adjust_solr_params do |params|
          params['facet'] = 'true'
          params['facet.missing'] = 'true'
          params['facet.pivot'] = this.pivots.map do |pivot|
            SolrUtils.indexed_field_name(Record.map_name(this.record_model.name), pivot)
          end.join(',')
          params['facet.pivot.mincount'] = this.exclude_zeros == true ? '1' : '-1'
          params['facet.pivot.limit'] = '-1'
        end
      end
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/PerceivedComplexity

    def stats_from_search(sunspot_search, user, managed_user_names = [])
      owner = owner_from_search(sunspot_search)
      name_map = field_name_solr_map
      facet_pivot = name_map.keys.join(',')
      rows = sunspot_search.facet_response['facet_pivot'][facet_pivot]
      rows = user_scoped_rows(rows, user, managed_user_names)
      row_stats(rows, owner, user, name_map)
    end

    def row_stats(rows, owner, user, name_map)
      return {} unless rows.present?

      rows.each_with_object({}) do |row, stats|
        stats[row['value']] = row['pivot'].to_h do |pivot|
          stat = {
            'count' => pivot['count'],
            'query' => stat_query_strings([row, pivot], owner, user, name_map)
          }
          [pivot['value'], stat]
        end
      end
    end

    def stat_query_strings(row_pivot, owner, user, name_map = {})
      row, pivot = row_pivot
      scope_query_strings + owner_query_string(owner) +
        referred_query_string(user) +
        transferred_query_string(user) +
        transferred_groups_query_string(user) +
        owned_by_groups_query_string(user) +
        not_last_updated_query_string(user) + name_map_row_pivot(name_map, row, pivot)
    end

    private

    def field_name_solr_map
      pivots.to_h do |pivot|
        [SolrUtils.indexed_field_name(record_model, pivot), pivot]
      end
    end

    def name_map_row_pivot(name_map, row, pivot)
      ["#{name_map[row['field']]}=#{row['value']}", "#{name_map[pivot['field']]}=#{pivot['value']}"]
    end
  end
end
