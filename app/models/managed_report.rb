# frozen_string_literal: true

# Describes ManagedReport in Primero.
class ManagedReport < ValueObject
  DATE_RANGE_OPTIONS = %w[this_quarter last_quarter this_year last_year this_month last_month].freeze

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
        subreports: %w[killing maiming detention rape denial_humanitarian_access abduction recruitment],
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

  def exporter
    Exporters::ManagedReportExporter
  end

  def date_range_filter
    filters&.find { |filter| filter.is_a?(SearchFilters::DateRange) }
  end

  def date_field_name
    date_range_filter&.field_name
  end

  def date_range_value
    date_filter = date_range_filter

    return unless date_filter.present?

    DATE_RANGE_OPTIONS.find { |option| date_filter.send("#{option}?".to_sym) }
  end

  def verified_value
    filters&.find { |filter| filter.field_name == 'verified_ctfmr_technical' }&.value
  end
end
