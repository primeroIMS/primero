# frozen_string_literal: true

# Describes Maiming subreport in Primero.
class ManagedReports::SubReports::Maiming < ManagedReports::SubReport
  def id
    'maiming'
  end

  def indicators
    [
      ManagedReports::Indicators::ViolationTally,
      ManagedReports::Indicators::Perpetrators,
      ManagedReports::Indicators::ReportingLocation,
      ManagedReports::Indicators::AttackType
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::Perpetrators.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::ReportingLocation.id => 'Location',
      ManagedReports::Indicators::AttackType.id => 'lookup-attack-type'
    }
  end
end
