# frozen_string_literal: true

# Concern for Services Subreport Exporter
class Exporters::ServicesSubreportExporter < Exporters::FieldSubreportExporter
  def field
    'service_type'
  end

  def field_lookup_id
    'lookup-service-type'
  end
end
