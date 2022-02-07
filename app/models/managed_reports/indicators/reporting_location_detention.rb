# frozen_string_literal: true

# An indicator that returns the reporting locations of violation type killing
class ManagedReports::Indicators::ReportingLocationDetention < ManagedReports::SqlReportIndicator
  class << self
    def id
      'reporting_location'
    end

    def sql(current_user, params = [])
      admin_level = user_reporting_location_admin_level(current_user)

      %{
        select (string_to_array(incidents."data" ->> 'reporting_location_hierarchy', '.'))[#{admin_level}] as id,
        count(violations.id) as total
        from violations violations
        inner join incidents incidents on incidents.id = violations.incident_id
        inner join individual_victims_violations ivv on violations .id = ivv.violation_id
        inner join individual_victims iv on ivv.individual_victim_id = iv.id
        WHERE incidents.data->>'reporting_location_hierarchy' is not null
        #{filter_query(params)}
        and (iv.data->>'victim_deprived_liberty_security_reasons')::boolean
        group by (string_to_array(incidents."data" ->> 'reporting_location_hierarchy', '.'))[#{admin_level}];
      }
    end

    def date_range_query(param)
      namespace = namespace_for_query(param.field_name)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "to_timestamp(#{namespace}.data ->> ?, 'YYYY-MM-DDTHH\\:\\MI\\:\\SS') between ? and ?",
          param.field_name,
          param.from,
          param.to
        ]
      )
    end

    def equal_value_query(param)
      namespace = namespace_for_query(param.field_name)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ["#{namespace}.data ->> ? = ?", param.field_name, param.value]
      )
    end

    def build(current_user, args = {})
      super(current_user, args, &:to_a)
    end

    def user_reporting_location_admin_level(current_user)
      # Adding one since admin level start from 0, but string on postgres start from 1
      current_user.role.incident_reporting_location_config&.admin_level.to_i + 1
    end
  end
end
