# frozen_string_literal: true

# An indicator that returns the reporting locations for individual victioms -detention
class ManagedReports::Indicators::ReportingLocationDetention < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'reporting_location'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      admin_level = user_reporting_location_admin_level(current_user)

      %{
        select (string_to_array(incidents."data" ->> 'reporting_location_hierarchy', '.'))[#{admin_level}] as name,
        'total' as key,
        #{grouped_date_query(params['grouped_by'],
                             filter_date(params),
                             table_name_for_query(params))&.concat(' as group_id,')}
        count(iv.id) as sum
        from violations violations
        inner join incidents incidents
          on incidents.id = violations.incident_id
          #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        inner join individual_victims_violations ivv on violations .id = ivv.violation_id
        inner join individual_victims iv on ivv.individual_victim_id = iv.id
        WHERE incidents.data->>'reporting_location_hierarchy' is not null
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'incidents')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        and (iv.data->>'victim_deprived_liberty_security_reasons') = 'true'
        group by (string_to_array(incidents."data" ->> 'reporting_location_hierarchy', '.'))[#{admin_level}]
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity

    def user_reporting_location_admin_level(current_user)
      # Adding one since admin level start from 0, but string on postgres start from 1
      current_user.role.incident_reporting_location_config&.admin_level.to_i + 1
    end
  end
end
