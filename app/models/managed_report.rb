# frozen_string_literal: true

# Describes ManagedReport in Primero.
class ManagedReport < ValueObject
  attr_accessor :id, :name, :description, :module_id, :subreports, :data, :filter_names

  REPORTS = {
    Permission::GBV_STATISTICS_REPORT => ManagedReport.new(
      id: 'gbv_statistics',
      name: 'managed_reports.gbv_statistics.name',
      description: 'managed_reports.gbv_statistics.description',
      subreports: %w[incidents],
      filter_names: %w[date_of_first_report incident_date],
      module_id: PrimeroModule::GBV
    ),
    Permission::VIOLATION_REPORT => ManagedReport.new(
      id: 'violations',
      name: 'managed_reports.violations.name',
      description: 'managed_reports.violations.description',
      subreports: %w[killing],
      filter_names: %w[subreport date_of_first_report date_of_incident ctfmr_verified verified_ctfmr_technical],
      module_id: PrimeroModule::MRM
    )
  }.freeze

  def build_report(params = [], subreport_id = nil)
    self.data = (filter_subreport(subreport_id)).reduce({}) do |acc, id|
      subreport = "ManagedReports::SubReports::#{id.camelize}".constantize.new
      subreport.build_report(subreport_params(params, id))
      acc.merge(subreport.id => subreport.data)
    end
  end

  def filter_subreport(subreport_id)
    return subreports if subreport_id.blank?

    subreports.select { |subreport| subreport == subreport_id }
  end

  def subreport_params(params, subreport_id)
    filtered_params = params.select { |param| filter_names.include?(param.field_name) }

    return filtered_params unless id == 'violations'

    filtered_params << SearchFilters::Value.new(field_name: 'violation_type', value: subreport_id)
  end
end
