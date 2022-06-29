# frozen_string_literal: true

# An indicator that returns the incidents for vulnerable populations
class ManagedReports::Indicators::SurvivorsVulnerablePopulations < ManagedReports::SqlReportIndicator
  class << self
    def id
      'vulnerable_populations'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
          *
        from (
          select
            'survivors_disability_type' as id,
            #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
            count(*) as total
          from incidents
          where data ->> 'disability_type' = 'true'
          #{date_range_query(date_param)&.prepend('and ')}
          #{equal_value_query(params['module_id'])&.prepend('and ')}
          #{user_scope_query(current_user)&.prepend('and ')}
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
          union
          select
            data ->> 'unaccompanied_separated_status' as id,
            #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
            count(*) as total
          from incidents
          where data ->> 'unaccompanied_separated_status' is not null
          and data ->> 'unaccompanied_separated_status' <> 'no'
          #{date_range_query(date_param)&.prepend('and ')}
          #{equal_value_query(params['module_id'])&.prepend('and ')}
          #{user_scope_query(current_user)&.prepend('and ')}
          group by data ->> 'unaccompanied_separated_status'
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
        ) as survivors
        order by id
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end
