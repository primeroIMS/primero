# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
      ManagedReports::Indicators::NumberOfPerpetrators.id => 'lookup-number-of-perpetrators',
      ManagedReports::Indicators::PerpetratorRelationship.id => 'lookup-perpetrator-relationship',
      ManagedReports::Indicators::PerpetratorAgeGroup.id => 'lookup-perpetrator-age-group',
      ManagedReports::Indicators::PerpetratorOccupation.id => 'lookup-perpetrator-occupation'
    }.freeze
  end

  def indicators_rows
    services_provided_rows = %w[
      service_safehouse_referral service_medical_referral service_psycho_referral service_legal_referral
      service_police_referral service_livelihoods_referral service_protection_referral
    ].map { |id| { id:, display_text: row_display_texts("services_provided.#{id}") } }

    age_ranges = [
      {
        id: 'children_17_younger',
        display_text: row_display_texts('survivors_age.children_17_younger'),
        separator: true
      },
      { id: '0 - 11', display_text: row_display_texts('survivors_age.age_0_11') },
      { id: '12 - 17', display_text: row_display_texts('survivors_age.age_12_17') },
      { id: 'adults_18_older', display_text: row_display_texts('survivors_age.adults_18_older'), separator: true },
      { id: '50+', display_text: row_display_texts('survivors_age.age_50_more') },
      { id: '10 - 19', display_text: row_display_texts('survivors_age.age_10_19') }
    ]

    {
      ManagedReports::Indicators::SurvivorsNumberOfServicesProvided.id => services_provided_rows,
      ManagedReports::Indicators::SurvivorsNumberOfServicesProvidedOther.id => services_provided_rows,
      ManagedReports::Indicators::SurvivorsAge.id => age_ranges
    }
  end
  # rubocop:enable Metrics/MethodLength

  def indicators_subcolumns
    {
      ManagedReports::Indicators::SurvivorsNumberOfServicesProvidedOther.id => 'lookup-service-referred'
    }
  end

  private

  def row_display_texts(key)
    I18n.available_locales.each_with_object({}) do |locale, memo|
      memo[locale] = I18n.t("managed_reports.gbv_statistics.#{key}", locale:)
    end
  end
end
