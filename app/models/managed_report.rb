# frozen_string_literal: true

# Describes ManagedReport in Primero.
class ManagedReport < ValueObject
  attr_accessor :id, :name, :description, :subreports, :data, :filter_names
  REPORTS = {
    Permission::VIOLATION_REPORT => ManagedReport.new(
      id: 'violations',
      name: 'managed_reports.violations.name',
      description: 'managed_reports.violations.description',
      subreports: [
        ManagedReports::SubReports::Killing.new
      ],
      filter_names: %w[violation_type date_of_first_report date_of_incident ctfmr_verified verified_ctfmr_technical]
    )
  }.freeze

  def build_report(params = [], subreport_id = nil)
    self.data = (filter_subreport(subreport_id)).reduce({}) do |acc, subreport|
      subreport.build_report(params.select { |param| filter_names.include?(param.field_name) })
      acc.merge(subreport.id => subreport.data)
    end
  end

  def filter_subreport(subreport_id)
    return subreports if subreport_id.blank?

    subreports.select { |subreport| subreport.id == subreport_id }
  end
end
