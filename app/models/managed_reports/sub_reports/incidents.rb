# frozen_string_literal: true

# Describes a Incidents subreport
class ManagedReports::SubReports::Incidents < ManagedReports::SubReport
  def id
    'incidents'
  end

  def indicators
    [
      ManagedReports::Indicators::TotalIncidents,
      ManagedReports::Indicators::TotalGBVSexualViolence,
      ManagedReports::Indicators::TotalGBVPreviousIncidents,
      ManagedReports::Indicators::GBVSexualViolenceType,
      ManagedReports::Indicators::IncidentTimeofday,
      ManagedReports::Indicators::ElapsedReportingTime,
      ManagedReports::Indicators::ElapsedReportingTimeRape,
      ManagedReports::Indicators::IncidentLocationType
    ].freeze
  end

  def lookups
    {
      ManagedReports::Indicators::GBVSexualViolenceType.id => 'lookup-gbv-sexual-violence-type',
      ManagedReports::Indicators::IncidentTimeofday.id => 'lookup-gbv-incident-timeofday',
      ManagedReports::Indicators::ElapsedReportingTime.id => 'lookup-elapsed-reporting-time',
      ManagedReports::Indicators::ElapsedReportingTimeRape.id => 'lookup-elapsed-reporting-time',
      ManagedReports::Indicators::IncidentLocationType.id => 'lookup-gbv-incident-location-type'
    }.freeze
  end
end
