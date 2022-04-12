# frozen_string_literal: true

# An indicator that returns the denial type for denial subreport
class ManagedReports::Indicators::DenialType < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'denial_type'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select json_array_elements_text(("violations"."data"->> 'denial_method')::JSON) as name,
        'total' as key,
        #{grouped_date_query(params['grouped_by'],
                             filter_date(params),
                             table_name_for_query(params))&.concat(' as group_id,')}
        count(violations.id) as sum
        from violations
        inner join incidents incidents
          on incidents.id = violations.incident_id
          #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        where
        #{equal_value_query(params['type'], 'violations')}
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        group by json_array_elements_text(("violations"."data"->> 'denial_method')::JSON)
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end
