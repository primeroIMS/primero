# frozen_string_literal: true

# Class to hold SQL results
class ManagedReports::SqlReportIndicator < ValueObject
  attr_accessor :params, :data

  class << self
    def sql(param_names = []); end

    def build(params = [])
      indicator = new(params: params)
      indicator.data = block_given? ? yield(indicator.execute_query) : indicator.execute_query
      indicator
    end

    def filter_query(params = [])
      param_names = params.map(&:field_name)
      query = ''
      query += and_date_range_query('date_of_first_report') if param_names.include?('date_of_first_report')
      query += and_date_range_query('incident_date') if param_names.include?('incident_date')
      query
    end

    def and_date_range_query(field_name)
      "and to_date(data ->> '#{field_name}', 'YYYY-MM-DD') between :#{field_name}_from and :#{field_name}_to"
    end
  end

  def execute_query
    ActiveRecord::Base.connection.execute(
      ActiveRecord::Base.sanitize_sql_array([self.class.sql(params), query_params])
    )
  end

  def query_params
    params.each_with_object({}) do |param, memo|
      if param.class == SearchFilters::DateRange
        memo["#{param.field_name}_from".to_sym] = param.from
        memo["#{param.field_name}_to".to_sym] = param.to
      else
        memo[param.field_name.to_sym] = param.value
      end
    end
  end
end
