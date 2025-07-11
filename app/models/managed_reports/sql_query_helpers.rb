# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Helper methods to query the db
module ManagedReports::SqlQueryHelpers
  extend ActiveSupport::Concern

  # ClassMethods
  # rubocop:disable Metrics/ModuleLength
  module ClassMethods
    def equal_value_query(param, table_name = nil, hash_field = 'data', map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name

      if hash_field.present?
        return ActiveRecord::Base.sanitize_sql_for_conditions(
          ["#{quoted_query(table_name, hash_field)} ->> ? = ?", field_name, param.value]
        )
      end

      ActiveRecord::Base.sanitize_sql_for_conditions(
        ["#{quoted_query(table_name, field_name)} = ?", param.value]
      )
    end

    def equal_value_query_multiple(param, table_name = nil, hash_field = 'data', map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name

      if param.respond_to?(:values)
        SearchFilters::TextList.new(field_name:, column_name: hash_field, table_name:, values: param.values).query
      else
        SearchFilters::TextValue.new(field_name:, column_name: hash_field, table_name:, value: param.value).query
      end
    end

    def equal_value_nested_query(param, _nested_field, table_name = nil, map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "#{quoted_query(table_name, 'data')} #> '{#{field_name}}' ?| array[:values]",
          { values: param.respond_to?(:values) ? param.values : param.value }
        ]
      )
    end

    # rubocop:disable Metrics/MethodLength
    def reporting_location_query(param, map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name
      param_value = param.respond_to?(:values) ? param.values : param.value

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            (
              data->>:field_name IS NOT NULL AND EXISTS
              (
                SELECT
                  1
                FROM locations
                INNER JOIN locations AS descendants
                ON locations.admin_level <= descendants.admin_level
                  AND locations.hierarchy_path @> descendants.hierarchy_path
                WHERE locations.location_code = :param_value AND descendants.location_code = data->>:field_name
              )
            )
          ),
          { param_value:, field_name: }
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength

    def in_value_query(param, table_name = nil, _hash_field = 'data', map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name
      param_value = param.respond_to?(:values) ? param.values : param.value

      ActiveRecord::Base.sanitize_sql_for_conditions(
        ["#{quoted_query(table_name, field_name)} in (?)", param_value]
      )
    end

    # rubocop:disable Metrics/MethodLength
    def date_range_query(param, table_name = nil, hash_field = 'data', map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name

      return date_range_hash_query(param, field_name, table_name, hash_field) if hash_field.present?

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            CAST(#{quoted_query(table_name, field_name)} AS TIMESTAMP) >= to_timestamp(:from, :date_format)
            AND CAST(#{quoted_query(table_name, field_name)} AS TIMESTAMP) <= (
              to_timestamp(:to, :date_format) + interval '1 day' - interval '1 second'
            )
          ), { from: param.from, to: param.to, date_format: Report::DATE_FORMAT }
        ]
      )
    end

    def date_range_hash_query(param, field_name, table_name = nil, hash_field = 'data')
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            to_timestamp(
              #{quoted_query(table_name, hash_field)} ->> :field_name, :date_format
            ) >= to_timestamp(:from, :date_format)
            AND to_timestamp(
              #{quoted_query(table_name, hash_field)} ->> :field_name, :date_format
            ) <= to_timestamp(:to, :date_format) + interval '1 day' - interval '1 second'
          ),
          { field_name:, date_format: Report::DATE_FORMAT, from: param.from, to: param.to }
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength

    def agency_scope_query(current_user, table_name = nil)
      SearchFilters::TextValue.new(
        field_name: 'associated_user_agencies', value: current_user.agency.unique_id, table_name:
      ).query
    end

    def group_scope_query(current_user, table_name = nil)
      SearchFilters::TextList.new(
        field_name: 'associated_user_groups', values: current_user.user_group_unique_ids, table_name:
      ).query
    end

    def self_scope_query(current_user, table_name = nil)
      SearchFilters::TextValue.new(
        field_name: 'associated_user_names', value: current_user.user_name, table_name:
      ).query
    end

    def quoted_query(table_name, column_name)
      return ActiveRecord::Base.sanitize_sql_for_conditions(['%s', column_name]) if table_name.blank?

      ActiveRecord::Base.sanitize_sql_for_conditions(['%s.%s', table_name, column_name])
    end

    def quoted_table_name(table_name)
      return unless table_name.present?

      ActiveRecord::Base.sanitize_sql_for_conditions(['%s', table_name])
    end

    def grouped_year_query(date_param, table_name = nil, hash_field = 'data', map_to = nil)
      return unless date_param.present?

      field_name = map_to || date_param.field_name
      quoted_field = grouped_date_field(field_name, table_name, hash_field)

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "DATE_PART('year', #{quoted_field})::integer",
          grouped_date_params(field_name, hash_field)
        ]
      )
    end

    def grouped_quarter_query(date_param, table_name = nil, hash_field = 'data', map_to = nil)
      return unless date_param.present?

      field_name = map_to || date_param.field_name
      quoted_field = grouped_date_field(field_name, table_name, hash_field)

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "DATE_PART('year', #{quoted_field})|| '-' || 'Q' || DATE_PART('quarter', #{quoted_field}) ",
          grouped_date_params(field_name, hash_field)
        ]
      )
    end

    def grouped_month_query(date_param, table_name = nil, hash_field = 'data', map_to = nil)
      return unless date_param.present?

      field_name = map_to || date_param.field_name
      quoted_field = grouped_date_field(field_name, table_name, hash_field)

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "DATE_PART('year', #{quoted_field}) || '-' || to_char(#{quoted_field}, 'mm')",
          grouped_date_params(field_name, hash_field)
        ]
      )
    end

    def grouped_date_field(field_name, table_name = nil, hash_field = 'data')
      return "to_timestamp(#{quoted_query(table_name, hash_field)} ->> :date_field, :format)" if hash_field.present?

      quoted_query(table_name, field_name)
    end

    def grouped_date_params(field_name, hash_field = 'data')
      return {} unless hash_field.present?

      { date_field: field_name, format: Report::DATE_TIME_FORMAT }
    end

    # rubocop:disable Metrics/MethodLength
    def age_ranges_query(field_name: 'age', table_name: nil, is_json_field: true, module_id: nil)
      age_ranges = AgeRangeService.primary_age_ranges(module_id&.value)
      age_ranges&.reduce("CASE \n") do |acc, range|
        column = age_range_column(field_name, table_name, is_json_field)

        acc + ActiveRecord::Base.sanitize_sql_for_conditions(
          [
            %{
               WHEN #{column} IS NULL THEN 'incomplete_data'
               WHEN int4range(:start, :end, '[]') @> CAST(#{column} AS INTEGER)
               THEN #{last_range?(range, age_ranges) ? "':start+' end" : "':start - :end'"}
             }, { field_name:, start: range.first, end: range.last }
          ]
        )
      end
    end
    # rubocop:enable Metrics/MethodLength

    def last_range?(range, age_ranges)
      range == age_ranges.last
    end

    def age_range_column(field_name = 'age', table_name = nil, is_json_field = true)
      return "#{quoted_query(table_name, 'data')} ->> :field_name" if is_json_field

      quoted_query(table_name, field_name)
    end
  end
  # rubocop:enable Metrics/ModuleLength
end
