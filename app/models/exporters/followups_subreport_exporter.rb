# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for Followups Subreport Exporter
class Exporters::FollowupsSubreportExporter < Exporters::FieldSubreportExporter
  def field
    'followup_type'
  end

  def field_lookup_id
    'lookup-followup-type'
  end
end
