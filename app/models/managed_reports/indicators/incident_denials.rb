# frozen_string_literal: true

# An indicator that returns the IncidentDenials
class ManagedReports::Indicators::IncidentDenials < ManagedReports::SqlReportIndicator
  class << self
    def id
      'denial_humanitarian_access'
    end

    # rubocop:disable Metrics/AbcSize
    def sql(current_user, params = {})
      %{
        select count(violations.id)
        from violations violations
        inner join incidents incidents
          on incidents.id = violations.incident_id
          #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        where #{equal_value_query(params['type'], 'violations')}
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
      }
    end
    # rubocop:enable Metrics/AbcSize

    def build(current_user = nil, args = {})
      super(current_user, args) do |result|
        result.first['count']
      end
    end
  end
end
