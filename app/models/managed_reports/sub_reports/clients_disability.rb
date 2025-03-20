# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases with Disability in Primero.
class ManagedReports::SubReports::ClientsDisability < ManagedReports::SubReport
  def id
    'clients_disability'
  end

  def indicators
    [
      ManagedReports::Indicators::PercentageClientsWithDisability
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::PercentageClientsWithDisability.id => 'lookup-yes-no'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::PercentageClientsWithDisability.id => 'lookup-gender-identity'
    }
  end
end
