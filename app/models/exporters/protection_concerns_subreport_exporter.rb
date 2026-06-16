# frozen_string_literal: true

# Concern for Protection Concerns Subreport Exporter
class Exporters::ProtectionConcernsSubreportExporter < Exporters::FieldSubreportExporter
  def field
    'protection_concerns'
  end

  def field_lookup_id
    'lookup-protection-concerns'
  end
end
