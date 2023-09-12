# frozen_string_literal: true

# Describes ManagedReport in Primero.
# rubocop:disable Metrics/ClassLength
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
        subreports: %w[incidents perpetrators survivors referrals],
        permitted_filters: [:grouped_by, { date_of_first_report: {}, incident_date: {} }],
        module_id: PrimeroModule::GBV
      ),
      Permission::WORKFLOW_REPORT => ManagedReport.new(
        id: 'workflow_report',
        name: 'managed_reports.workflow_report.name',
        description: 'managed_reports.workflow_report.description',
        subreports: %w[cases_workflow incidents_workflow],
        permitted_filters: [
          :grouped_by, :by, :created_by_groups, :workflow, :owned_by_groups,
          :created_organization, :owned_by_agency_id, { status: {}, registration_date: {} }
        ],
        module_id: PrimeroModule::CP
      ),
      Permission::REFERRALS_TRANSFERS_REPORT => ManagedReport.new(
        id: 'referrals_transfers_report',
        name: 'managed_reports.referrals_transfers_report.name',
        description: 'managed_reports.referrals_transfers_report.description',
        subreports: %w[total_transfers total_referrals],
        permitted_filters: [
          :grouped_by, :by, :created_by_groups, :owned_by_groups, :created_organization, :owned_by_agency_id,
          { status: {}, created_at: {}, referral_transfer_status: {} }
        ],
        module_id: PrimeroModule::CP
      ),
      Permission::VIOLENCE_TYPE_REPORT => ManagedReport.new(
        id: 'violence_type_report',
        name: 'managed_reports.violence_type_report.name',
        description: 'managed_reports.violence_type_report.description',
        subreports: %w[cases_violence_type incidents_violence_type],
        permitted_filters: [
          :grouped_by, :by, :created_by_groups, :cp_incident_violence_type, :owned_by_groups,
          :created_organization, :owned_by_agency_id, { status: {}, registration_date: {} }
        ],
        module_id: PrimeroModule::CP
      ),
      Permission::VIOLATION_REPORT => ManagedReport.new(
        id: 'violations',
        name: 'managed_reports.violations.name',
        description: 'managed_reports.violations.description',
        subreports: %w[
          killing maiming detention sexual_violence denial_humanitarian_access abduction recruitment attack_on_schools
          attack_on_hospitals military_use
        ],
        permitted_filters: [
          :grouped_by, :ctfmr_verified, :verified_ctfmr_technical,
          { date_of_first_report: {},
            incident_date: {}, ctfmr_verified_date: {} }
        ],
        module_id: PrimeroModule::MRM
      ),
      Permission::GHN_REPORT => ManagedReport.new(
        id: 'ghn_report',
        name: 'managed_reports.ghn_report.name',
        description: 'managed_reports.ghn_report.description',
        subreports: %w[ghn_report],
        permitted_filters: [
          :grouped_by, { ghn_date_filter: {} }
        ],
        module_id: PrimeroModule::MRM
      ),
      Permission::INDIVIDUAL_CHILDREN => ManagedReport.new(
        id: 'individual_children',
        name: 'managed_reports.individual_children.name',
        description: 'managed_reports.individual_children.description',
        subreports: %w[individual_children],
        permitted_filters: [
          :grouped_by, :ctfmr_verified, :verified_ctfmr_technical,
          { violation_type: {},
            date_of_first_report: {},
            incident_date: {}, ctfmr_verified_date: {} }
        ],
        module_id: PrimeroModule::MRM
      )
    }.freeze
  end
  # rubocop:enable Metrics/MethodLength

  def build_report(user, filters = [], opts = {})
    self.user = user
    self.filters = filters
    self.data = filter_subreport(opts&.dig(:subreport_id)).reduce({}) do |acc, id|
      subreport = "ManagedReports::SubReports::#{id.camelize}".constantize.new
      subreport.build_report(user, subreport_params(filters))
      acc.merge(subreport.id => subreport.data)
    end
  end

  def filter_subreport(subreport_id)
    return subreports if subreport_id.blank? || subreport_id == 'all'

    subreports.select { |subreport| subreport == subreport_id }
  end

  def subreport_params(params)
    filtered_params = (params || []).compact.select { |param| permitted_filter_names.include?(param.field_name) }
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
    filters&.find { |filter| filter&.field_name == 'ctfmr_verified' }&.value
  end
end
# rubocop:enable Metrics/ClassLength
