# frozen_string_literal: true

# Describes Killing subreport in Primero.
class ManagedReports::SubReports::IndividualChildren < ManagedReports::SubReport
  def id
    'individual_children'
  end

  def indicators
    [
      ManagedReports::Indicators::IndividualAge,
      ManagedReports::Indicators::IndividualRegion,
      ManagedReports::Indicators::IndividualViolationType,
      ManagedReports::Indicators::IndividualPerpetrator
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::IndividualViolationType.id => 'lookup-violation-type',
      ManagedReports::Indicators::IndividualRegion.id => 'ReportingLocation',
      ManagedReports::Indicators::IndividualPerpetrator.id => 'lookup-armed-force-group-or-other-party'
    }.freeze
  end

  def build_report(current_user, params = {})
    super(current_user, params.merge('type' => SearchFilters::Value.new(field_name: 'type', value: id)))
  end
end
