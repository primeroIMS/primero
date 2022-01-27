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
      queries = params.map do |param|
        "and #{date_range_query(param)}" if param.class == SearchFilters::DateRange
      end

      queries.join(' ')
    end

    def date_range_query(param, as_datetime = false)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          build_date_range_query(as_datetime),
          param.field_name,
          param.from,
          param.to
        ]
      )
    end

    def build_date_range_query(as_datetime = false)
      return "to_date(data ->> ?, 'YYYY-MM-DD') between ? and ?" unless as_datetime

      "to_timestamp(data ->> ?, 'YYYY-MM-DDTHH\\:\\MI\\:\\SS') between ? and ?"
    end
  end

  def execute_query
    ActiveRecord::Base.connection.execute(
      ActiveRecord::Base.sanitize_sql_array([self.class.sql(params)])
    )
  end
end
