# frozen_string_literal: true

# An indicator that returns status of violation type abduction
class ManagedReports::Indicators::AbductedStatus < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'abducted_status'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select status as name, sum(value::integer) as sum, key
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        from (
            select
            key, value,
            #{grouped_date_query(params['grouped_by'],
                                 filter_date(params),
                                 table_name_for_query(params))&.concat(' as group_id,')}
            (
              case
              when (violations."data"->>'abduction_regained_freedom' = 'no')
                then 'still_being_held'
              when (violations."data"->>'abduction_regained_freedom' = 'yes'
                and (
                  'escape' = ANY(
                    ARRAY(SELECT jsonb_array_elements_text(violations.data->'abduction_regained_freedom_how'))
                  ))
                )
                then 'escaped'
              when (violations."data"->>'abduction_regained_freedom' = 'yes'
                and (
                  ('escape' <> ANY(
                    ARRAY(SELECT jsonb_array_elements_text(violations.data->'abduction_regained_freedom_how'))
                  ))
                  or (violations."data"->>'abduction_regained_freedom_how' is null)
                )
              )
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
                  #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
                  #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
                  #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
             ) as subquery
         group by key, name
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        order by name
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end
