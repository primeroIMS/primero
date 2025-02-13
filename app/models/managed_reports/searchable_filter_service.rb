# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to generate filter queries using searchable/normalized tables
class ManagedReports::SearchableFilterService
  class << self
    def filter_datetimes(param, opts = {})
      return unless param.present?

      filter_query = searchable_date_range_query(param)
      searchable_join_query(filter_query, { join_alias: 'searchable_datetimes' }.merge(opts))
    end

    def filter_values(param, opts = {})
      value_query = searchable_filter_query(param)
      return unless value_query.present?

      searchable_join_query(value_query, { join_alias: 'values' }.merge(opts))
    end

    def filter_booleans(param, opts = {})
      value_query = searchable_filter_query(param, SearchableBoolean)
      return unless value_query.present?

      searchable_join_query(value_query, { join_alias: 'booleans' }.merge(opts))
    end

    def filter_scope(current_user, opts = {})
      scope_query = searchable_user_scope_query(current_user)
      return unless scope_query.present?

      searchable_join_query(scope_query, { join_alias: 'scope_ids' }.merge(opts))
    end

    def filter_reporting_location(param, opts = {})
      reporting_location_query = searchable_reporting_location_query(param, 'Child', 'owned_by_location')
      return unless reporting_location_query.present?

      searchable_join_query(reporting_location_query, { join_alias: 'location_record_ids' }.merge(opts))
    end

    def filter_consent_reporting(opts = {})
      return unless consent_reporting_visible?

      filter_booleans(
        SearchFilters::BooleanValue.new(field_name: 'consent_reporting', value: true),
        { join_alias: 'consents' }.merge(opts)
      )
    end

    def filter_next_steps(next_step = 'a_continue_protection_assessment', opts = {})
      filter_values(
        SearchFilters::TextValue.new(field_name: 'next_steps', value: next_step),
        { join_alias: 'next_steps' }.merge(opts)
      )
    end

    def searchable_date_range_query(param)
      return unless param.present?

      SearchableDatetime.where(
        'field_name = :field_name', field_name: param.field_name
      ).where(
        'value >= to_timestamp(:from, :date_format)', from: param.from, date_format: Report::DATE_FORMAT
      ).where(
        "value <= to_timestamp(:to, :date_format) + interval '1 day' - interval '1 second'",
        to: param.to,
        date_format: Report::DATE_FORMAT
      ).to_sql
    end

    # rubocop:disable Metrics/MethodLength
    def searchable_reporting_location_query(param, record_type = 'Child', map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
              (
                SELECT
                  record_id
                FROM searchable_values
                INNER JOIN (
                  SELECT
                    descendants.location_code
                  FROM locations
                  INNER JOIN locations AS descendants
                  ON locations.admin_level <= descendants.admin_level
                  AND locations.hierarchy_path @> descendants.hierarchy_path
                  WHERE locations.location_code = :location_code
                ) AS reporting_locations ON reporting_locations.location_code = searchable_values.value
                WHERE searchable_values.record_type = :record_type
	              AND searchable_values.field_name = :field_name
              )
          ),
          { record_type:, field_name:, location_code: param.value }
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength

    def searchable_filter_query(param, searchable_class = SearchableValue, map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name
      value = param.respond_to?(:value) ? param.value : param.values

      searchable_class.where(field_name:, value:, record_type: 'Child').to_sql
    end

    def searchable_user_scope_query(current_user)
      return if current_user.blank? || current_user.managed_report_scope_all?

      if current_user.managed_report_scope == Permission::AGENCY
        searchable_scope_query('associated_user_agencies', current_user.agency.unique_id)
      elsif current_user.managed_report_scope == Permission::GROUP
        searchable_scope_query('associated_user_groups', current_user.user_group_unique_ids)
      else
        searchable_scope_query('associated_user_names', current_user.user_name)
      end
    end

    def searchable_scope_query(field_name, value)
      SearchableValue.select(:record_id).distinct.where(field_name:, value:).to_sql
    end

    def sanitize_value(value)
      return unless value.present?

      ActiveRecord::Base.sanitize_sql_for_conditions(['%s', value])
    end

    def consent_reporting_visible?
      Field.find_by(name: 'consent_reporting')&.visible?
    end

    def searchable_join_query(filter_query, opts = {})
      join_opts = { table_name: 'cases', field_name: 'id', join_alias: 'values' }.merge(opts)
      table_name = sanitize_value(join_opts[:table_name])
      field_name = sanitize_value(join_opts[:field_name])
      join_alias = sanitize_value(join_opts[:join_alias])

      %(
        INNER JOIN (#{filter_query}) AS #{join_alias}
        ON #{table_name}.#{field_name} = #{join_alias}.record_id
      )
    end
  end
end
