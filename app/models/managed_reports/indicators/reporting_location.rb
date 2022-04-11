# frozen_string_literal: true

# An indicator that returns the reporting locations of violation type killing
class ManagedReports::Indicators::ReportingLocation < ManagedReports::SqlReportIndicator
  class << self
    def id
      'reporting_location'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    def sql(current_user, params = {})
      admin_level = user_reporting_location_admin_level(current_user)

      %{
        select name, key, sum(value::integer)
        from (
            select
            key, value,
            (string_to_array(incidents."data" ->> 'reporting_location_hierarchy', '.'))[#{admin_level}] as name
            from violations violations
            inner join incidents incidents
              on incidents.id = violations.incident_id
              #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
            cross join json_each_text((violations."data"->>'violation_tally')::JSON)
            where incidents.data->>'reporting_location_hierarchy' is not null
            and violations."data"->>'violation_tally' is not null
            #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
            #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
            #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
            #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
            #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
            ) keys_values
        group by key, name
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity

    def build(current_user, args = {})
      super(current_user, args) do |result|
        result.group_by { |r| r['name'] }.map do |_key, values|
          values.each_with_object({}) do |curr, acc|
            acc[:id] = curr['name']
            acc[curr['key'].to_sym] = curr['sum']
          end
        end
      end
    end

    def user_reporting_location_admin_level(current_user)
      # Adding one since admin level start from 0, but string on postgres start from 1
      current_user.role.incident_reporting_location_config&.admin_level.to_i + 1
    end
  end
end
