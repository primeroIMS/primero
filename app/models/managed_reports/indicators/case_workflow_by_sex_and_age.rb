# frozen_string_literal: true

# An indicator that returns the total cases by workflow and sex
class ManagedReports::Indicators::CaseWorkflowBySexAndAge < ManagedReports::SqlReportIndicator
  include ManagedReports::TsfvIndicatorHelper

  class << self
    def id
      'case_workflow_by_sex_and_age'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
          with case_workflow_by_sex_and_age as (
            select
              data->> 'sex' as name,
              #{age_ranges_query} as key,
              #{grouped_date_query(params['grouped_by'], filter_date(params))&.concat(' as group_id,')}
              count(*) as sum
            from cases
            where 1 = 1
            #{equal_value_query_multiple(params['owned_by_groups'])&.prepend('and ')}
            #{equal_value_query_multiple(params['created_by_groups'])&.prepend('and ')}
            #{equal_value_query_multiple(params['status'])&.prepend('and ')}
            #{date_range_query(date_param)&.prepend('and ')}
            #{equal_value_query(params['module_id'])&.prepend('and ')}
            #{equal_value_query(params['workflow'])&.prepend('and ')}
            #{user_scope_query(current_user)&.prepend('and ')}
            group by name, key
              #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
            order by name, key
          )
          select
            name, key, sum #{params['grouped_by'].present? ? ', group_id' : ''}
          from case_workflow_by_sex_and_age
          union all
          select
            name,
            'total' as key,
            cast(sum(sum) as integer) as sum
            #{params['grouped_by'].present? ? ', group_id' : ''}
          from case_workflow_by_sex_and_age
          group by name #{params['grouped_by'].present? ? ', group_id' : ''}
          union all
          select
           'total' as name,
            key,
            cast(sum(sum) as integer) as sum
            #{params['grouped_by'].present? ? ', group_id' : ''}
          from case_workflow_by_sex_and_age
          group by key #{params['grouped_by'].present? ? ', group_id' : ''}
          union all
          select
           'total' as name,
           'total' as key,
           cast(sum(sum) as integer) as sum
           #{params['grouped_by'].present? ? ', group_id' : ''}
          from case_workflow_by_sex_and_age
          #{params['grouped_by'].present? ? 'group by group_id' : ''}
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end
