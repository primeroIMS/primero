# frozen_string_literal: true

# Describes a Perpetrators subreport
class ManagedReports::SubReports::Survivors < ManagedReports::SubReport
  def id
    'survivors'
  end

  def indicators
    [
      ManagedReports::Indicators::SurvivorsAge,
      ManagedReports::Indicators::SurvivorsSex,
      ManagedReports::Indicators::SurvivorsMaritalStatus,
      ManagedReports::Indicators::SurvivorsDisplacementStatus,
      ManagedReports::Indicators::SurvivorsDisplacementIncident
    ].freeze
  end

  def lookups
    {
      ManagedReports::Indicators::SurvivorsSex.id => 'lookup-gender',
      ManagedReports::Indicators::SurvivorsMaritalStatus.id => 'lookup-marital-status',
      ManagedReports::Indicators::SurvivorsDisplacementStatus.id => 'lookup-displacement-status',
      ManagedReports::Indicators::SurvivorsDisplacementIncident.id => 'lookup-displacement-incident'
    }.freeze
  end
end
