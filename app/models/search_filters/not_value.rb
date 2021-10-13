# frozen_string_literal: true

# Transform API query parameter not[field_name]=value into a Sunspot query
class SearchFilters::NotValue < SearchFilters::SearchFilter
  attr_accessor :field_name, :values

  def query_scope(sunspot)
    this = self
    sunspot.instance_eval do
      without(this.field_name, this.values)
    end
  end

  def as_location_filter(record_class)
    return self unless location_field_filter?(record_class)

    clone do |f|
      f.field_name = location_field_name_solr(field_name, values)
    end
  end

  def location_field_filter?(record_class)
    record_class.searchable_location_fields.include?(field_name)
  end

  def to_h
    {
      type: 'not',
      field_name: field_name,
      value: values
    }
  end

  def to_s
    "not[#{field_name}]=#{values&.join(',')}"
  end
end
