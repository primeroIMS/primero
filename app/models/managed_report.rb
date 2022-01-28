# frozen_string_literal: true

# Describes ManagedReport in Primero.
class ManagedReport < ValueObject
  attr_accessor :id, :name, :description, :module_id, :subreports, :data, :permitted_filters

  REPORTS = {
    Permission::GBV_STATISTICS_REPORT => ManagedReport.new(
      id: 'gbv_statistics',
      name: 'managed_reports.gbv_statistics.name',
      description: 'managed_reports.gbv_statistics.description',
      subreports: %w[incidents],
      permitted_filters: [date_of_first_report: {}, incident_date: {}],
      module_id: PrimeroModule::GBV
    )
  }.freeze

  def build_report(filters = [], subreport_id = nil)
    params_for_subreport = subreport_params(filters)
    self.data = (filter_subreport(subreport_id)).reduce({}) do |acc, id|
      subreport = "ManagedReports::SubReports::#{id.camelize}".constantize.new
      subreport.build_report(params_for_subreport)
      acc.merge(subreport.id => subreport.data)
    end
  end

  def filter_subreport(subreport_id)
    return subreports if subreport_id.blank?

    subreports.select { |subreport| subreport == subreport_id }
  end

  def subreport_params(params)
    filtered_params = params.select { |param| permitted_filter_names.include?(param.field_name) }

    return filtered_params unless id == 'gbv_statistics'

    filtered_params << SearchFilters::Value.new(field_name: 'module_id', value: module_id)
  end

  def permitted_filter_names
    permitted_filters.map { |filter| filter.is_a?(Hash) ? filter.keys.map(&:to_s) : filter.to_s }.flatten
  end
end
