# frozen_string_literal: true

# Describes ManagedReport in Primero.
class ManagedReport < ValueObject
  DATE_FIELD_NAMES = %w[incident_date date_of_first_report ctfmr_verified_date].freeze

  attr_accessor :id, :name, :description, :module_id, :subreports, :data, :permitted_filters, :user, :filters

  # rubocop:disable Metrics/MethodLength
  def self.list
    {
      Permission::GBV_STATISTICS_REPORT => ManagedReport.new(
        id: 'gbv_statistics',
        name: 'managed_reports.gbv_statistics.name',
        description: 'managed_reports.gbv_statistics.description',
        subreports: %w[incidents perpetrators],
        permitted_filters: [date_of_first_report: {}, incident_date: {}],
        module_id: PrimeroModule::GBV
      ),
      Permission::VIOLATION_REPORT => ManagedReport.new(
        id: 'violations',
        name: 'managed_reports.violations.name',
        description: 'managed_reports.violations.description',
        subreports: %w[killing maiming detention sexual_violence],
        permitted_filters: [
          :ctfmr_verified, :verified_ctfmr_technical,
          date_of_first_report: {},
          incident_date: {}, ctfmr_verified_date: {}
        ],
        module_id: PrimeroModule::MRM
      )
    }.freeze
  end
  # rubocop:enable Metrics/MethodLength

  def build_report(user, filters = [], opts = {})
    self.user = user
    self.filters = filters
    self.data = (filter_subreport(opts&.dig(:subreport_id))).reduce({}) do |acc, id|
      subreport = "ManagedReports::SubReports::#{id.camelize}".constantize.new
      subreport.build_report(user, subreport_params(filters))
      acc.merge(subreport.id => subreport.data)
    end
  end

  def filter_subreport(subreport_id)
    return subreports if subreport_id.blank?

    subreports.select { |subreport| subreport == subreport_id }
  end

  def subreport_params(params)
    filtered_params = (params || []).select { |param| permitted_filter_names.include?(param.field_name) }
    filtered_params << SearchFilters::Value.new(field_name: 'module_id', value: module_id) if id == 'gbv_statistics'

    filtered_params.reduce({}) { |acc, param| acc.merge(param.field_name => param) }
  end

  def permitted_filter_names
    permitted_filters.map { |filter| filter.is_a?(Hash) ? filter.keys.map(&:to_s) : filter.to_s }.flatten
  end

  def export(user, filters, opts = {})
    build_report(user, filters, opts)
    Exporters::ManagedReportExporter.export(self, opts)
  end

  def filtered_by?(field_name)
    filters&.any? { |filter| filter.field_name == field_name }
  end
end
