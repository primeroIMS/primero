# frozen_string_literal: true

# Transform API query parameter field_name=value into a Sunspot query
class SearchFilters::Value < SearchFilters::SearchFilter
  attr_accessor :field_name, :value

  def query_scope(sunspot)
    this = self
    sunspot.instance_eval do
      with(this.field_name, this.value)
    end
  end

  def as_location_filter(record_class)
    return self unless location_field_filter?(record_class)

    clone do |f|
      f.field_name = location_field_name_solr(field_name, value)
    end
  end

  def location_field_filter?(record_class)
    record_class.searchable_location_fields.include?(field_name)
  end

  def to_h
    {
      type: 'value',
      field_name: field_name,
      value: value
    }
  end

  def to_s
    "#{field_name}=#{value}"
  end
end
