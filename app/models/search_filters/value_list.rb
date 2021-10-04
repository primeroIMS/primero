# frozen_string_literal: true

# Transform API query parameter field_name=value1,value2,... into a Sunspot query
class SearchFilters::ValueList < SearchFilters::SearchFilter
  attr_accessor :field_name, :values

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def query_scope(sunspot)
    this = self
    sunspot.instance_eval do
      if this.values.first.is_a?(Hash)
        any_of do
          this.values.each do |v|
            with(this.field_name, v['from']...v['to'])
          end
        end
      else
        with(this.field_name).any_of(this.values)
      end
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def as_location_filter(record_class)
    return self unless location_field_filter?(record_class)

    location_filters = values.map do |value|
      SearchFilters::Value.new(
        field_name: location_field_name_solr(field_name, value), value: value
      )
    end
    SearchFilters::Or.new(filters: location_filters)
  end

  def location_field_filter?(record_class)
    record_class.searchable_location_fields.include?(field_name)
  end

  def to_h
    {
      type: 'values',
      field_name: field_name,
      value: values
    }
  end

  def to_s
    "#{field_name}=#{values&.join(',')}"
  end
end
