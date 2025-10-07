# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Clients by Gender in Primero
class ManagedReports::SubReports::ClientsGender < ManagedReports::SubReport
  def id
    'clients_gender'
  end

  def indicators
    [
      ManagedReports::Indicators::PercentageClientsGender
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::PercentageClientsGender.id => 'lookup-gender-identity'
    }
  end
end
