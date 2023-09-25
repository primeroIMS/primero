# frozen_string_literal: true

# Represents a query against a date field
class Reports::FieldQueries::DateFieldQuery < Reports::FieldQueries::FieldQuery
  attr_accessor :group_by

  def to_sql
    return date_range_query if group_by_date?

    date_query
  end

  def group_by_date?
    Report::DATE_RANGES.include?(group_by)
  end

  def date_range_query
    # TODO: Add group by quarter
    case group_by
    when Report::YEAR then grouped_by_year_query
    when Report::MONTH then grouped_by_month_query
    when Report::WEEK then grouped_by_week_query
    else
      grouped_by_day_query
    end
  end

  def sort_field
    return super unless [Report::DAY, Report::MONTH, Report::WEEK].include?(group_by)

    column_name('sort')
  end

  def date_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "to_timestamp(#{data_column_name} ->> :field_name, :date_format) as #{column_name}",
        { field_name: field.name,
          date_format: field.date_include_time ? Report::DATE_TIME_FORMAT : Report::DATE_FORMAT }
      ]
    )
  end

  def grouped_by_year_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          CAST(
            DATE_PART('year', to_timestamp(#{data_column_name} ->> :field_name, :date_format)) AS INTEGER
          ) as #{column_name}
        ),
        { field_name: field.name, date_format: Report::DATE_FORMAT }
      ]
    )
  end

  def grouped_by_month_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          #{sort_by_month_query},
          DATE_PART('year', to_timestamp(#{data_column_name} ->> :field_name, :date_format)) || '-' ||
          to_char(to_timestamp(#{data_column_name} ->> :field_name, :date_format), 'Mon')
          as #{column_name}
        ),
        { field_name: field.name, date_format: Report::DATE_FORMAT }
      ]
    )
  end

  def sort_by_month_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "date_trunc('month', to_timestamp(#{data_column_name} ->> :field_name, :date_format)) as #{sort_field}",
        { field_name: field.name, date_format: Report::DATE_FORMAT }
      ]
    )
  end

  # rubocop:disable Metrics/MethodLength
  def grouped_by_week_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          #{sort_by_week_query},
          to_char(
            date_trunc('week', to_timestamp(#{data_column_name} ->> :field_name, :date_format)), 'dd-Mon-yyyy'
          ) || ' - ' ||
          to_char(
            date_trunc('week', to_timestamp(#{data_column_name} ->> :field_name, :date_format)) + '6 days'::interval,
            'dd-Mon-yyyy'
          ) as #{column_name}
        ),
        { field_name: field.name,
          date_format: Report::DATE_FORMAT }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def sort_by_week_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "date_trunc('week', to_timestamp(#{data_column_name} ->> :field_name, :date_format)) as #{sort_field}",
        { field_name: field.name,
          date_format: Report::DATE_FORMAT }
      ]
    )
  end

  def grouped_by_day_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          #{sort_by_day_query},
          to_char(to_timestamp(#{data_column_name} ->> :field_name, :date_format), :date_format) as #{column_name}
        ),
        { field_name: field.name,
          date_format: Report::DATE_FORMAT }
      ]
    )
  end

  def sort_by_day_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "to_timestamp(#{data_column_name} ->> :field_name, :date_format) as #{sort_field}",
        { field_name: field.name,
          date_format: Report::DATE_FORMAT }
      ]
    )
  end
end
