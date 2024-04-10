# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for Protection Concerns Subreport Exporter
class Exporters::ProtectionConcernsSubreportExporter < Exporters::FieldSubreportExporter
  def field
    'protection_concerns'
  end

  def field_lookup_id
    'lookup-protection-concerns'
  end
end
