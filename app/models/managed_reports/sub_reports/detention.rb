# frozen_string_literal: true

# Describes Detention subreport in Primero.
class ManagedReports::SubReports::Detention < ManagedReports::SubReport
  def id
    'detention'
  end

  def indicators
    [
      ManagedReports::Indicators::ViolationTallyDetention,
      ManagedReports::Indicators::PerpetratorsDetention,
      ManagedReports::Indicators::ReportingLocationDetention,
      ManagedReports::Indicators::DetentionStatus
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::Perpetrators.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::ReportingLocation.id => 'Location'
    }
  end
end
