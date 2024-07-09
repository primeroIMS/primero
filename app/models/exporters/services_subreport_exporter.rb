# frozen_string_literal: true

# Copyright (c) 2014 - 2024 UNICEF. All rights reserved.

# Concern for Services Subreport Exporter
class Exporters::ServicesSubreportExporter < Exporters::FieldSubreportExporter
  def field
    'service_type'
  end

  def field_lookup_id
    'lookup-service-type'
  end
end
