# frozen_string_literal: true

# Describes Denial subreport in Primero.
class ManagedReports::SubReports::DenialHumanitarianAccess < ManagedReports::SubReport
  def id
    'denial_humanitarian_access'
  end

  def indicators
    [
      ManagedReports::Indicators::IncidentDenials,
      ManagedReports::Indicators::PerpetratorsDenials,
      ManagedReports::Indicators::ReportingLocationDenials,
      ManagedReports::Indicators::DenialType
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::Perpetrators.id => 'lookup-armed-force-group-or-other-party',
      ManagedReports::Indicators::ReportingLocationDenials.id => 'Location',
      ManagedReports::Indicators::DenialType.id => 'lookup-denial-method'
    }
  end

  def build_report(current_user, params = {})
    super(current_user, params.merge('type' => SearchFilters::Value.new(field_name: 'type', value: id)))
  end
end
