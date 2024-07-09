# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases based on workflow status by gender/age subreport in Primero.
class ManagedReports::SubReports::Followups < ManagedReports::SubReport
  def id
    'followups'
  end

  def indicators
    [
      ManagedReports::Indicators::Followups
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::Followups.id => 'lookup-gender'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::Followups.id => 'AgeRange'
    }
  end
end
