# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases based on workflow status by gender/age subreport in Primero.
class ManagedReports::SubReports::ProtectionConcerns < ManagedReports::SubReport
  def id
    'protection_concerns'
  end

  def indicators
    [
      ManagedReports::Indicators::ProtectionConcerns
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::ProtectionConcerns.id => 'lookup-gender'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::ProtectionConcerns.id => 'AgeRange'
    }
  end
end
