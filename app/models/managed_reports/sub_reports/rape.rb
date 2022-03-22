# frozen_string_literal: true

# Describes Rape subreport in Primero.
class ManagedReports::SubReports::Rape < ManagedReports::SubReport
  def id
    'rape'
  end

  def indicators
    [
      ManagedReports::Indicators::ViolationTally,
      ManagedReports::Indicators::Perpetrators,
      ManagedReports::Indicators::ReportingLocation,
      ManagedReports::Indicators::SexualViolenceType
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::Perpetrators.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::ReportingLocation.id => 'Location',
      ManagedReports::Indicators::SexualViolenceType.id => 'lookup-mrm-sexual-violence-type'
    }
  end
end
