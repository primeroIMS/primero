# frozen_string_literal: true

# Describes Attack on schools subreport in Primero.
class ManagedReports::SubReports::AttackOnSchools < ManagedReports::SubReport
  def id
    'attack_on_schools'
  end

  def indicators
    [
      ManagedReports::Indicators::FacilityAttackType,
      ManagedReports::Indicators::PerpetratorsDenials,
      ManagedReports::Indicators::ReportingLocationDenials
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::Perpetrators.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::ReportingLocation.id => 'Location'
    }
  end

  def build_report(current_user, params = {})
    super(current_user, params.merge('type' => SearchFilters::Value.new(field_name: 'type', value: id)))
  end
end
