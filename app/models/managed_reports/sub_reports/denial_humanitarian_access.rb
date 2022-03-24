# frozen_string_literal: true

# Describes Denial subreport in Primero.
class ManagedReports::SubReports::DenialHumanitarianAccess < ManagedReports::SubReport
  def id
    'denial_humanitarian_access'
  end

  def indicators
    [
      ManagedReports::Indicators::IncidentDenials,
      ManagedReports::Indicators::PerpetratorsDenials,
      ManagedReports::Indicators::ReportingLocationDenials,
      ManagedReports::Indicators::DenialType
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::Perpetrators.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::ReportingLocation.id => 'Location',
      ManagedReports::Indicators::DenialType.id => 'lookup-denial-method'
    }
  end
end
