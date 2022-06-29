# frozen_string_literal: true

# Describes SexualViolence subreport in Primero.
class ManagedReports::SubReports::SexualViolence < ManagedReports::SubReport
  def id
    'sexual_violence'
  end

  def indicators
    [
      ManagedReports::Indicators::ViolationTally,
      ManagedReports::Indicators::ViolationTallyResponse,
      ManagedReports::Indicators::Perpetrators,
      ManagedReports::Indicators::ReportingLocation,
      ManagedReports::Indicators::SexualViolenceType
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::Perpetrators.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::ReportingLocation.id => 'Location',
      ManagedReports::Indicators::SexualViolenceType.id => 'lookup-mrm-sexual-violence-type',
      ManagedReports::Indicators::ViolationTally.id => 'lookup-violation-tally-options'
    }
  end

  def build_report(current_user, params = {})
    super(current_user, params.merge('type' => SearchFilters::Value.new(field_name: 'type', value: id)))
  end

  def indicators_subcolumns
    sub_column_items = sub_column_items(lookups[ManagedReports::Indicators::ViolationTally.id])

    {
      ManagedReports::Indicators::Perpetrators.id => sub_column_items,
      ManagedReports::Indicators::ReportingLocation.id => sub_column_items,
      ManagedReports::Indicators::SexualViolenceType.id => sub_column_items
    }
  end
end
