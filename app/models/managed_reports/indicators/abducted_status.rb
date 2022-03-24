# frozen_string_literal: true

# An indicator that returns the reporting locations of violation type killing
class ManagedReports::Indicators::AbductedStatus < ManagedReports::SqlReportIndicator
  class << self
    def id
      'abducted_status'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    def sql(current_user, params = {})
      %{
        select status, key, sum(value::integer)
        from (
            select
            key, value,
            (
              case
              when (violations."data"->>'abduction_regained_freedom' = "no")
                then 'still_being_held'
              when (violations."data"->>'abduction_regained_freedom' = "yes"
                and violations."data"->>'abduction_regained_freedom_how' = "escape")
                then 'escape'
              when (violations."data"->>'abduction_regained_freedom' = "yes"
                and violations."data"->>'abduction_regained_freedom_how' <> "escape")
                then 'released'
              else violations."data"->>'abduction_regained_freedom'
              end
            ) as status
                  from violations violations
                  inner join incidents incidents
                    on incidents.id = violations.incident_id
                    #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
                  cross join json_each_text((violations."data"->>'violation_tally')::JSON)
                  WHERE violations."data"->>'abduction_regained_freedom' is not null
                  #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
                  #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
                  #{date_range_query(params['ctfmr_verified_date'], 'incidents')&.prepend('and ')}
                  #{equal_value_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
                  #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
                  #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
                  #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
             ) as subquery
         group by key, name
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity

    def build(current_user, args = {})
      super(current_user, args, &:to_a)
    end
  end
end
