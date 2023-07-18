# frozen_string_literal: true

# Helper methods for tsfv indicators
module ManagedReports::WeekIndicatorHelper
  extend ActiveSupport::Concern
  # ClassMethods
  module ClassMethods
    def build_results(results, params = {})
      return build_data_values(results.to_a) unless results.to_a.any? { |result| result['group_id'].present? }

      build_groups(results, params)
    end

    def build_data_values(values)
      values.each_with_object([]) do |curr, acc|
        current_group = acc.find { |group| group[:id] == curr['name'] }
        next current_group[curr['key'].to_sym] = curr['sum'] if current_group.present?

        acc << { id: curr['name'], curr['key'].to_sym => curr['sum'] }
      end
    end

    def range_by_group(grouped_by_value, date_range)
      return super(grouped_by_value, date_range) unless grouped_by_value == ManagedReports::SqlReportIndicator::WEEK

      date_range.map do |date|
        "#{date.beginning_of_week.strftime('%Y-%m-%d')} - #{date.end_of_week.strftime('%Y-%m-%d')}"
      end.uniq
    end

    # rubocop:disable Metrics/MethodLength
    def grouped_by_week_query(date_param, table_name)
      return unless date_param.present?

      quoted_field = "#{quoted_query(table_name, 'data')} ->> :date_field"

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            to_char(date_trunc('week', to_timestamp(#{quoted_field}, :format)) - '1 days'::interval, 'yyyy-mm-dd')
            || ' - ' ||
            to_char(date_trunc('week', to_timestamp(#{quoted_field}, :format)) + '5 days'::interval, 'yyyy-mm-dd')
          ),
          date_field: date_param.field_name, format: Report::DATE_TIME_FORMAT
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength

    def grouped_date_query(grouped_by_param, date_param, table_name = nil)
      if grouped_by_param&.value == ManagedReports::SqlReportIndicator::WEEK && date_param.present?
        return grouped_by_week_query(date_param, table_name)
      end

      super(grouped_by_param, date_param, table_name)
    end
  end
end
