# frozen_string_literal: true

# Class to hold SQL results
class ManagedReports::SqlReportIndicator < ValueObject
  attr_accessor :params, :data

  class << self
    def sql(params = []); end

    def build(params = [])
      indicator = new(params: params)
      indicator.data = block_given? ? yield(indicator.execute_query) : indicator.execute_query
      indicator
    end

    def filter_query(params = [])
      params.reduce('') do |acc, param|
        if param.class == SearchFilters::DateRange
          acc + "and #{date_range_query(param)}"
        else
          acc + "and #{equal_value_query(param)}"
        end
      end
    end

    def equal_value_query(param)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ['data ->> ? = ?', param.field_name, param.value]
      )
    end

    def date_range_query(param)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "to_timestamp(data ->> ?, 'YYYY-MM-DDTHH\\:\\MI\\:\\SS') between ? and ?",
          param.field_name,
          param.from,
          param.to
        ]
      )
    end

    def incident_join(params = [])
      param_names = params.map(&:field_name)

      return '' unless param_names.any? { |elem| %w[incident_date date_of_first_report].include?(elem) }

      'inner join incidents i on i.id = v.incident_id'
    end
  end

  def execute_query
    ActiveRecord::Base.connection.execute(
      ActiveRecord::Base.sanitize_sql_array([self.class.sql(params)])
    )
  end

  def apply_params(query)
    params.each do |param|
      if param.class == SearchFilters::DateRange
        query = query.where(self.class.date_range_query(param))
      else
        query = query.where(self.class.equal_value_query(param))
      end
    end

    query
  end
end
