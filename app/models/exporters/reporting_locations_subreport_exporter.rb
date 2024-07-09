# frozen_string_literal: true

# Copyright (c) 2014 - 2024 UNICEF. All rights reserved.

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
