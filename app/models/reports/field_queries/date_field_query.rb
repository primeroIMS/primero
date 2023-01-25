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
        field_name: field.name, date_format: field.date_include_time ? 'YYYY-MM-DDTHH\\:\\MI\\:\\SS' : 'YYYY-MM-DD'
      ]
    )
  end

  def grouped_by_year_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          CAST(
            DATE_PART('year', to_timestamp(#{data_column_name} ->> :field_name, 'YYYY-MM-DD')) AS INTEGER
          ) as #{column_name}
        ),
        field_name: field.name
      ]
    )
  end

  def grouped_by_month_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          #{sort_by_month_query},
          DATE_PART('year', to_timestamp(#{data_column_name} ->> :field_name, 'YYYY-MM-DD')) || '-' ||
          to_char(to_timestamp(#{data_column_name} ->> :field_name, 'YYYY-MM-DD'), 'Mon')
          as #{column_name}
        ),
        field_name: field.name
      ]
    )
  end

  def sort_by_month_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "date_trunc('month', to_timestamp(#{data_column_name} ->> :field_name, 'YYY-MM-DD')) as #{sort_field}",
        field_name: field.name
      ]
    )
  end

  # rubocop:disable Metrics/MethodLength
  def grouped_by_week_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          #{sort_by_week_query},
          to_char(date_trunc('week', to_timestamp(#{data_column_name} ->> :field_name, 'YYY-MM-DD')),'dd-Mon-yyyy') || ' - ' ||
          to_char(
            date_trunc('week', to_timestamp(#{data_column_name} ->> :field_name, 'YYY-MM-DD')) + '6 days'::interval,
            'dd-Mon-yyyy'
          ) as #{column_name}
        ),
        field_name: field.name
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def sort_by_week_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "date_trunc('week', to_timestamp(#{data_column_name} ->> :field_name, 'YYY-MM-DD')) as #{sort_field}",
        field_name: field.name
      ]
    )
  end

  def grouped_by_day_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          #{sort_by_day_query},
          to_char(to_timestamp(#{data_column_name} ->> :field_name, 'YYYY-MM-DD'), 'YYYY-MM-DD') as #{column_name}
        ),
        field_name: field.name
      ]
    )
  end

  def sort_by_day_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "to_timestamp(#{data_column_name} ->> :field_name, 'YYYY-MM-DD') as #{sort_field}",
        field_name: field.name
      ]
    )
  end
end
