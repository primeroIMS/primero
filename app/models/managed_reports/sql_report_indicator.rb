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
      query += and_equal_query('verified_ctfmr_technical') if param_names.include?('verified_ctfmr_technical')
      query += and_equal_query('ctfmr_verified') if param_names.include?('ctfmr_verified')
      query
    end

    def and_date_range_query(field_name)
      %{
        and to_date(data ->> '#{field_name}', 'YYYY-MM-DD') between :#{field_name}_from and :#{field_name}_to"
      }
    end

    def and_equal_query(field_name)
      %(
        and v.data->>'#{field_name}' = :#{field_name}
      )
    end

    def incident_join(params = [])
      param_names = params.map(&:field_name)

      return '' unless param_names.any? { |elem| %w[date_of_incident date_of_first_report].include?(elem) }

      'inner join incidents i on i.id = v.incident_id'
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
