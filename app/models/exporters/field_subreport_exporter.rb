# frozen_string_literal: true

# Copyright (c) 2014 - 2024 UNICEF. All rights reserved.

# Concern for Record Workflow Subreport Exporter
class Exporters::FieldSubreportExporter < Exporters::SubreportExporter
  include Exporters::Concerns::RecordFilterInsightParams

  def field
    raise NotImplementedError
  end

  def field_lookup_id
    raise NotImplementedError
  end

  def reporting_locations_field?
    false
  end

  def params_list
    view_by_param + date_range_param + date_range_values_param + filter_by_date_param + status_param +
      field_param + by_param + user_group_param + agency_param
  end

  def field_param
    return [] unless field_filter.present?

    [
      formats[:bold_blue], "#{I18n.t("managed_reports.filter_by.#{field}", locale:)}: ",
      formats[:black], "#{field_display_text} / "
    ]
  end

  def location_value
    Location.get_by_location_code(field_filter.value)&.placename_i18n&.dig(locale) || field_filter.value
  end

  def lookup_value
    lookup_values = Lookup.values(field_lookup_id, nil, locale:)

    lookup_values&.filter { |f| field_filter.values.include? f['id'] }
                 &.map { |f| f['display_text'] }
                 &.join(', ') || field_filter.values
  end

  def field_display_text
    return location_value if reporting_locations_field?

    lookup_value
  end

  def field_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == field }
  end
end
