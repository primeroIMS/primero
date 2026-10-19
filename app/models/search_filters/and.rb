# frozen_string_literal: true

# Transform API query parameter and[field_name1]=value1&and[field_name2]=value2 into a sql query
class SearchFilters::And < SearchFilters::SearchFilter
  attr_accessor :filters

  def query(record_class = nil)
    filters.map { |filter| filter.query(record_class) }.join(' AND ')
  end

  def as_location_filter(record_class)
    return self unless location_field_filter?(record_class)

    SearchFilters::And.new(filters: filters.map { |f| f.as_location_filter(record_class) })
  end

  def location_field_filter?(record_class)
    filters.any? { |f| f.location_field_filter?(record_class) }
  end

  def as_id_filter(record_class)
    return self unless id_field_filter?(record_class)

    SearchFilters::And.new(filters: filters.map { |f| f.as_id_filter(record_class) })
  end

  def id_field_filter?(record_class)
    filters.any? { |f| f.id_field_filter?(record_class) }
  end

  def to_h
    filters_hash = filters&.map(&:to_h) || []
    {
      type: 'and',
      filters: filters_hash
    }
  end

  def to_s
    filters.map.with_index do |filter, index|
      key, value = filter.to_s.split('=')
      "and[#{index}][#{key}]=#{value}"
    end
  end
end
