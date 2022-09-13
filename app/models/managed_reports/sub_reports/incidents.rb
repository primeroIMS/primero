# frozen_string_literal: true

# Describes a Incidents subreport
class ManagedReports::SubReports::Incidents < ManagedReports::SubReport
  def id
    'incidents'
  end

  # rubocop:disable Metrics/MethodLength
  def indicators
    [
      ManagedReports::Indicators::TotalIncidents,
      ManagedReports::Indicators::TotalGBVPreviousIncidents,
      ManagedReports::Indicators::SurvivorsSex,
      ManagedReports::Indicators::SurvivorsAge,
      ManagedReports::Indicators::SurvivorsMaritalStatus,
      ManagedReports::Indicators::SurvivorsDisplacementStatus,
      ManagedReports::Indicators::SurvivorsDisplacementIncident,
      ManagedReports::Indicators::SurvivorsVulnerablePopulations,
      ManagedReports::Indicators::TotalGBVSexualViolence,
      ManagedReports::Indicators::GBVSexualViolenceType,
      ManagedReports::Indicators::IncidentTimeofday,
      ManagedReports::Indicators::GBVCaseContext,
      ManagedReports::Indicators::ElapsedReportingTime,
      ManagedReports::Indicators::ElapsedReportingTimeRape,
      ManagedReports::Indicators::ElapsedReportingTimeRapeHealthReferral,
      ManagedReports::Indicators::IncidentLocationType,
      ManagedReports::Indicators::NumberOfPerpetrators,
      ManagedReports::Indicators::PerpetratorRelationship,
      ManagedReports::Indicators::PerpetratorAgeGroup,
      ManagedReports::Indicators::PerpetratorOccupation,
      ManagedReports::Indicators::IncidentsFirstPointOfContact,
      ManagedReports::Indicators::IncidentsFromOtherServiceProvider,
      ManagedReports::Indicators::SurvivorsNumberOfServicesProvided,
      ManagedReports::Indicators::SurvivorsNumberOfServicesProvidedOther
    ].freeze
  end

  def lookups
    {
      ManagedReports::Indicators::GBVSexualViolenceType.id => 'lookup-gbv-sexual-violence-type',
      ManagedReports::Indicators::IncidentTimeofday.id => 'lookup-gbv-incident-timeofday',
      ManagedReports::Indicators::ElapsedReportingTime.id => 'lookup-elapsed-reporting-time',
      ManagedReports::Indicators::ElapsedReportingTimeRape.id => 'lookup-elapsed-reporting-time',
      ManagedReports::Indicators::ElapsedReportingTimeRapeHealthReferral.id => 'lookup-elapsed-reporting-time',
      ManagedReports::Indicators::IncidentLocationType.id => 'lookup-gbv-incident-location-type',
      ManagedReports::Indicators::GBVCaseContext.id => 'lookup-gbv-case-context',
      ManagedReports::Indicators::SurvivorsSex.id => 'lookup-gender',
      ManagedReports::Indicators::SurvivorsMaritalStatus.id => 'lookup-marital-status',
      ManagedReports::Indicators::SurvivorsDisplacementStatus.id => 'lookup-displacement-status',
      ManagedReports::Indicators::SurvivorsDisplacementIncident.id => 'lookup-displacement-incident',
      ManagedReports::Indicators::SurvivorsVulnerablePopulations.id => 'lookup-unaccompanied-separated-status',
      ManagedReports::Indicators::SurvivorsSex.id => 'lookup-gender',
      ManagedReports::Indicators::SurvivorsMaritalStatus.id => 'lookup-marital-status',
      ManagedReports::Indicators::SurvivorsDisplacementStatus.id => 'lookup-displacement-status',
      ManagedReports::Indicators::SurvivorsDisplacementIncident.id => 'lookup-displacement-incident',
      ManagedReports::Indicators::SurvivorsVulnerablePopulations.id => 'lookup-unaccompanied-separated-status'
    }.freeze
  end
  # rubocop:enable Metrics/MethodLength
end
