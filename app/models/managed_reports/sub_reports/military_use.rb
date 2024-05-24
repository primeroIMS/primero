# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Military use of school(s) and/or hospital(s) subreport in Primero.
class ManagedReports::SubReports::MilitaryUse < ManagedReports::SubReport
  def id
    'military_use'
  end

  def indicators
    [
      ManagedReports::Indicators::MilitaryUse
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::MilitaryUse.id => 'lookup lookup-military-use-type'
    }
  end

  def build_report(current_user, params = {})
    super(current_user, params.merge('type' => SearchFilters::Value.new(field_name: 'type', value: id)))
  end
end
