# frozen_string_literal: true

# Describes Killing subreport in Primero.
class ManagedReports::SubReports::GhnReport < ManagedReports::SubReport
  def id
    'ghn_report'
  end

  def indicators
    [
      ManagedReports::Indicators::VerifiedInformation,
      ManagedReports::Indicators::VerifiedInformationViolations,
      ManagedReports::Indicators::LateVerification,
      ManagedReports::Indicators::LateVerificationViolations,
      ManagedReports::Indicators::UnverifiedInformation,
      ManagedReports::Indicators::UnverifiedInformationViolations,
      ManagedReports::Indicators::MultipleViolations
    ]
  end

  def display_graph
    false
  end

  def build_report(current_user, params = {})
    super(current_user, params.merge('type' => SearchFilters::Value.new(field_name: 'type', value: id)))
  end

  def table_type
    id
  end
end
