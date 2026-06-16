# frozen_string_literal: true

# Concern for Reporting Locations Subreport Exporter
class Exporters::ReportingLocationsSubreportExporter < Exporters::FieldSubreportExporter
  def field
    'location'
  end

  def reporting_locations_field?
    true
  end

  def field_lookup_id
    ''
  end
end
