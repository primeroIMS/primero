# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases based on workflow status by gender/age subreport in Primero.
class ManagedReports::SubReports::Services < ManagedReports::SubReport
  def id
    'services'
  end

  def indicators
    [
      ManagedReports::Indicators::Services
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::Services.id => 'lookup-gender'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::Services.id => 'AgeRange'
    }
  end
end
