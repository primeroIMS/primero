# frozen_string_literal: true

# An indicator that returns the reporting locations of violation type killing
class ManagedReports::Indicators::ReportingLocation < ManagedReports::SqlReportIndicator
  class << self
    def id
      'reporting_location'
    end

    # rubocop:disable Metrics/AbcSize
    def sql(params = {})
      # TODO: Currently we return incident_location, the reporting_location will be fix in a future ticket
      %{
        select incidents."data"->>'incident_location' as id, count(violations.id) as total
        from violations violations
        inner join incidents incidents on incidents.id = violations.incident_id
        WHERE incidents.data->>'incident_location' is not null
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
        group by incidents."data"->>'incident_location';
      }
    end
    # rubocop:enable Metrics/AbcSize

    def build(args = {})
      super(args, &:to_a)
    end
  end
end
