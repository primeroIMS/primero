# frozen_string_literal: true

# Superclass for all SearchFilter objects that transform API query parameters into Sunspot queries
class SearchFilters::SearchFilter < ValueObject
  def to_json(_obj)
    to_h.to_json
  end

  def as_location_filter(_record_class)
    self
  end

  def location_field_filter?(_record_class)
    false
  end

  def location_field_name_solr(field_name, location_code)
    admin_level = LocationService.instance.find_by_code(location_code).admin_level
    "#{field_name}#{admin_level}"
  end
end
