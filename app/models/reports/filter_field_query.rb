# frozen_string_literal: true

# Filters an active record query by field
class Reports::FilterFieldQuery < ValueObject
  CONSTRAINTS = %w[= > <].freeze
  attr_accessor :query, :field, :filter, :record_field_name, :permission_filter

  def data_column_name
    ActiveRecord::Base.connection.quote_column_name(record_field_name || 'data')
  end

  def apply
    return permission_filter_query if permission_filter?
    return not_null_query if not_null_constraint?
    return multi_select_query if field.multi_select?
    return array_query if filter['value'].is_a?(Array) && filter['value'].size > 1

    field_type_query
  end

  def permission_filter?
    permission_filter.present?
  end

  def permission_filter_query
    query.where("#{data_column_name}->:attribute ?& array[:value]", permission_filter.with_indifferent_access)
  end

  def multi_select_query
    query.where("#{data_column_name}->:attribute ?| array[:value]", filter.with_indifferent_access)
  end

  def array_query
    query.where("#{data_column_name} ->> :attribute IN (:value)", filter.with_indifferent_access)
  end

  def not_null_query
    self.query = query.where("#{data_column_name}->:attribute is not null", attribute: filter['attribute'])
    return query unless field.multi_select?

    query.where("jsonb_array_length(#{data_column_name}->:attribute) > 0", attribute: filter['attribute'])
  end

  def not_null_constraint?
    filter['constraint'] == 'not_null'
  end

  def constraint
    CONSTRAINTS.include?(filter['constraint']) ? filter['constraint'] : '='
  end

  def field_type_query
    case field.type
    when Field::DATE_FIELD then date_field_query
    when Field::TICK_BOX then tick_box_query
    when Field::NUMERIC_FIELD then numeric_query
    else
      query.where("#{data_column_name} ->> :attribute = :value", filter.with_indifferent_access)
    end
  end

  def numeric_query
    query.where(
      "CAST(#{data_column_name} ->> :attribute AS INTEGER) #{constraint} :value", filter.with_indifferent_access
    )
  end

  def tick_box_query
    query.where("CAST(#{data_column_name} ->> :attribute AS BOOLEAN) = :value", filter.with_indifferent_access)
  end

  def date_field_query
    date_format = field.date_include_time ? 'YYYY-MM-DDTHH\\:\\MI\\:\\SS' : 'YYYY-MM-DD'
    query.where(
      "to_timestamp(#{data_column_name} ->> :attribute, :format) #{constraint} to_timestamp(:value, :format)",
      filter.merge('format' => date_format).with_indifferent_access
    )
  end
end
