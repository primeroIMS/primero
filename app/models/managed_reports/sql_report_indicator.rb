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
      params.reduce('') do |acc, param|
        acc + "and #{date_range_query(param)}" if param.class == SearchFilters::DateRange
        acc + "and #{equal_query(param)}" if param.class != SearchFilters::DateRange
      end
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

    def equal_query(param)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          'and v.data->> ? = ?',
          param.field_name,
          param.value

        ]
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
      ActiveRecord::Base.sanitize_sql_array([self.class.sql(params)])
    )
  end
end
