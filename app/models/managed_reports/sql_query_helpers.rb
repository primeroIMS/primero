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

    def equal_value_query_multiple(param, table_name = nil, map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "#{quoted_query(table_name, 'data')} #> '{#{field_name}}' ?| array[:values]",
          { values: param.respond_to?(:values) ? param.values : param.value }
        ]
      )
    end

    def reporting_location_query(param, _table_name = nil, _hash_field = 'data', map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name
      param_value = param.respond_to?(:values) ? param.values : param.value

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            (
              data->>:field_name = :param_value AND data->>:field_name IS NOT NULL AND EXISTS
              (
                SELECT
                  1
                FROM locations
                INNER JOIN locations AS descendants
                ON locations.admin_level <= descendants.admin_level
                  AND locations.hierarchy_path @> descendants.hierarchy_path
                WHERE locations.location_code = data->>:field_name AND descendants.location_code = data->>:field_name
              )
            )
          ),
          { param_value:, field_name: }
        ]
      )
    end

    def in_value_query(param, table_name = nil, _hash_field = 'data', map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name
      param_value = param.respond_to?(:values) ? param.values : param.value

      ActiveRecord::Base.sanitize_sql_for_conditions(
        ["#{quoted_query(table_name, field_name)} in (?)", param_value]
      )
    end

    def date_range_query(param, table_name = nil, hash_field = 'data', map_to = nil)
      return unless param.present?

      field_name = map_to || param.field_name

      return date_range_hash_query(param, field_name, table_name, hash_field) if hash_field.present?

      ActiveRecord::Base.sanitize_sql_for_conditions(
        ["#{quoted_query(table_name, field_name)}  between ? and ?", param.from, param.to]
      )
    end

    def date_range_hash_query(param, field_name, table_name = nil, hash_field = 'data')
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "to_timestamp(#{quoted_query(table_name, hash_field)} ->> ?, ?) between ? and ?",
          field_name, Report::DATE_TIME_FORMAT, param.from, param.to
        ]
      )
    end

    def agency_scope_query(current_user, table_name = nil)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "#{quoted_query(table_name, 'data')} #> '{associated_user_agencies}' ?| array[:agencies]",
          { agencies: [current_user.agency.unique_id] }
        ]
      )
    end

    def group_scope_query(current_user, table_name = nil)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "#{quoted_query(table_name, 'data')} #> '{associated_user_groups}' ?| array[:groups]",
          { groups: current_user.user_group_unique_ids }
        ]
      )
    end

    def self_scope_query(current_user, table_name = nil)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "#{quoted_query(table_name, 'data')} #> '{associated_user_names}' ?| array[:user_names]",
          { user_names: [current_user.user_name] }
        ]
      )
    end

    def quoted_query(table_name, column_name)
      return ActiveRecord::Base.connection.quote_column_name(column_name) if table_name.blank?

      "#{quoted_table_name(table_name)}.#{ActiveRecord::Base.connection.quote_column_name(column_name)}"
    end

    def quoted_table_name(table_name)
      return unless table_name.present?

      ActiveRecord::Base.connection.quote_table_name(table_name)
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

    def age_ranges_query(field_name = 'age', table_name = nil, is_json_field = true)
      SystemSettings.primary_age_ranges.reduce("case \n") do |acc, range|
        column = age_range_column(field_name, table_name, is_json_field)

        acc + ActiveRecord::Base.sanitize_sql_for_conditions(
          [
            %{ when int4range(:start, :end, '[]') @> cast(#{column} as integer)
               then #{last_range?(range) ? "':start+' end" : "':start - :end'"}
            }, { field_name:, start: range.first, end: range.last }
          ]
        )
      end
    end

    def last_range?(range)
      range == SystemSettings.primary_age_ranges.last
    end

    def age_range_column(field_name = 'age', table_name = nil, is_json_field = true)
      return "#{quoted_query(table_name, 'data')} ->> :field_name" if is_json_field

      quoted_query(table_name, field_name)
    end
  end
  # rubocop:enable Metrics/ModuleLength
end
