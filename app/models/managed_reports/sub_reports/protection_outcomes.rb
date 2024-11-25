# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases based on in Primero.
class ManagedReports::SubReports::ProtectionOutcomes < ManagedReports::SubReport
  def id
    'protection_outcomes'
  end

  def indicators
    [
      ManagedReports::Indicators::ImprovedWellbeingAfterSupport
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::ImprovedWellbeingAfterSupport.id => 'lookup-gender'
    }
  end
end
