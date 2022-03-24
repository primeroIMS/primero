# frozen_string_literal: true

# An indicator that returns the denial type for denial subreport
class ManagedReports::Indicators::DenialType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'denial_type'
    end

    # rubocop:disable Metrics/AbcSize
    def sql(current_user, params = {})
      %{
        select json_array_elements_text(("violations"."data"->> 'denial_method')::JSON) as id,
        count(violations.id) as total
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
        #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
        group by json_array_elements_text(("violations"."data"->> 'denial_method')::JSON)
      }
    end
    # rubocop:enable Metrics/AbcSize

    def build(current_user = nil, args = {})
      super(current_user, args, &:to_a)
    end
  end
end
