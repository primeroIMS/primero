# frozen_string_literal: true

# Describes Maiming subreport in Primero.
class ManagedReports::SubReports::Maiming < ManagedReports::SubReport
  def id
    'maiming'
  end

  def indicators
    [
      ManagedReports::Indicators::ViolationTally,
      ManagedReports::Indicators::ViolationTallyResponse,
      ManagedReports::Indicators::Perpetrators,
      ManagedReports::Indicators::ReportingLocation,
      ManagedReports::Indicators::AttackType
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::Perpetrators.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::ReportingLocation.id => 'Location',
      ManagedReports::Indicators::AttackType.id => 'lookup-attack-type',
      ManagedReports::Indicators::ViolationTally.id => 'lookup-violation-tally-options',
      ManagedReports::Indicators::ViolationTallyResponse.id => 'lookup-violation-tally-options'
    }
  end

  def build_report(current_user, params = {})
    super(current_user, params.merge('type' => SearchFilters::Value.new(field_name: 'type', value: id)))
  end
end
