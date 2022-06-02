# frozen_string_literal: true

# Describes a Referrals subreport
class ManagedReports::SubReports::Referrals < ManagedReports::SubReport
  def id
    'referrals'
  end

  def indicators
    [
      ManagedReports::Indicators::IncidentsFirstPointOfContact,
      ManagedReports::Indicators::IncidentsFromOtherServiceProvider,
      ManagedReports::Indicators::SurvivorsNumberOfServicesProvided,
      ManagedReports::Indicators::SurvivorsNumberOfServicesProvidedOther
    ].freeze
  end
end
