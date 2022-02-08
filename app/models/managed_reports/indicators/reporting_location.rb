# frozen_string_literal: true

# An indicator that returns the reporting locations of violation type killing
class ManagedReports::Indicators::ReportingLocation < ManagedReports::SqlReportIndicator
  class << self
    def id
      'reporting_location'
    end

    # rubocop:disable Metrics/AbcSize
    def sql(current_user, params = {})
      admin_level = user_reporting_location_admin_level(current_user)
      # TODO: Currently we return incident_location, the reporting_location will be fix in a future ticket
      %{
        select (string_to_array(incidents."data" ->> 'reporting_location_hierarchy', '.'))[#{admin_level}] as id,
        count(violations.id) as total
        from violations violations
        inner join incidents incidents on incidents.id = violations.incident_id
        WHERE incidents.data->>'reporting_location_hierarchy' is not null
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'incidents')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
        group by (string_to_array(incidents."data" ->> 'reporting_location_hierarchy', '.'))[#{admin_level}];
      }
    end
    # rubocop:enable Metrics/AbcSize

    def build(current_user, args = {})
      super(current_user, args, &:to_a)
    end

    def user_reporting_location_admin_level(current_user)
      # Adding one since admin level start from 0, but string on postgres start from 1
      current_user.role.incident_reporting_location_config&.admin_level.to_i + 1
    end
  end
end
