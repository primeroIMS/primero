# frozen_string_literal: true

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
