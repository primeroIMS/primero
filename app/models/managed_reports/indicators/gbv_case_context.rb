# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by context
class ManagedReports::Indicators::GBVCaseContext < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_case_context'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
          context as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents,
        jsonb_array_elements_text(data #> '{gbv_case_context}') as context
        where data ->> 'gbv_case_context' is not NULL
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by context
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      }
    end
  end
end
