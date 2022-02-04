# frozen_string_literal: true

# Class to hold SQL results
class ManagedReports::SqlReportIndicator < ValueObject
  attr_accessor :params, :data

  class << self
    def sql(params = {}); end

    def build(params = {})
      indicator = new(params: params)
      indicator.data = block_given? ? yield(indicator.execute_query) : indicator.execute_query
      indicator
    end

    def equal_value_query(param, table_name = nil)
      return unless param.present?

      ActiveRecord::Base.sanitize_sql_for_conditions(
        ["#{quoted_query(table_name, 'data')} ->> ? = ?", param.field_name, param.value]
      )
    end

    def date_range_query(param, table_name = nil)
      return unless param.present?

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "to_timestamp(#{quoted_query(table_name, 'data')} ->> ?, 'YYYY-MM-DDTHH\\:\\MI\\:\\SS') between ? and ?",
          param.field_name,
          param.from,
          param.to
        ]
      )
    end

    def quoted_query(table_name, column_name)
      "#{quoted_table_name(table_name)&.send(:+, '.')}#{ActiveRecord::Base.connection.quote_column_name(column_name)}"
    end

    def quoted_table_name(table_name)
      return unless table_name.present?

      ActiveRecord::Base.connection.quote_table_name(table_name)
    end

    def incidents_join(params)
      return unless params['incident_date'].present? || params['date_of_first_report'].present?

      'inner join incidents incidents on incidents.id = violations.incident_id'
    end
  end

  def execute_query
    ActiveRecord::Base.connection.execute(
      ActiveRecord::Base.sanitize_sql_array([self.class.sql(params)])
    )
  end

  def apply_params(query)
    params.values.each do |param|
      if param.class == SearchFilters::DateRange
        query = query.where(self.class.date_range_query(param))
        next
      end

      query = query.where(self.class.equal_value_query(param))
    end

    query
  end
end
