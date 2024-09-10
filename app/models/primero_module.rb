# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Configures the behavior of a module of Primero
class PrimeroModule < ApplicationRecord
  include ConfigurationRecord

  CP = 'primeromodule-cp'
  GBV = 'primeromodule-gbv'
  MRM = 'primeromodule-mrm'

  CP_DEFAULT_CASE_LIST_HEADERS = %w[id name complete age sex registration_date
                                    photo social_worker alert_count flag_count].freeze
  GBV_DEFAULT_CASE_LIST_HEADERS = %w[id complete survivor_code case_opening_date
                                    social_worker alert_count flag_count].freeze
  MRM_DEFAULT_CASE_LIST_HEADERS = %w[id complete social_worker alert_count flag_count].freeze

  # allow_searchable_ids: TODO document
  # selectable_approval_types: TODO document
  # agency_code_indicator: TODO document. Still used?
  # workflow_status_indicator: Boolean. Show the workflow status bar for cases.
  # use_workflow_case_plan: Boolean. Case plan is a status in the workflow bar.
  # use_workflow_assessment: Boolean. Assessment is a status in the workflow bar.
  # use_workflow_service_implemented: Boolean. Workflow status bar indicates status when all services are implemented.
  # reporting_location_filter: TODO document
  # user_group_filter: TODO document
  # use_webhooks_for: String array of record types that can register webhooks.
  # use_webhook_sync_for: String array of record types that allow reverse syncs from downstream systems.
  store_accessor(
    :module_options,
    :allow_searchable_ids, :selectable_approval_types,
    :workflow_status_indicator, :agency_code_indicator, :use_workflow_service_implemented,
    :use_workflow_case_plan, :use_workflow_assessment, :reporting_location_filter,
    :user_group_filter, :use_webhooks_for, :use_webhook_sync_for,
    :list_filters, :list_headers
  )

  belongs_to :primero_program, optional: true
  has_and_belongs_to_many :form_sections, inverse_of: :primero_modules
  has_and_belongs_to_many :roles, -> { distinct }

  validates :name, presence: { message: I18n.t('errors.models.primero_module.name_present') },
                   uniqueness: { message: I18n.t('errors.models.primero_module.unique_name') }
  validates_presence_of :associated_record_types,
                        message: I18n.t('errors.models.primero_module.associated_record_types')

  before_create :set_unique_id
  after_save :sync_forms

  def program_name
    primero_program.try(:name)
  end

  def associated_forms(include_subforms = false)
    result = form_sections
    result.each { |f| f.module_name = name }
    result.reject(&:is_nested) unless include_subforms
    result
  end

  def associated_forms_grouped_by_record_type(include_subforms = false)
    forms = associated_forms(include_subforms)
    return {} if forms.blank?

    forms.each { |f| f.module_name = name }
    forms.group_by(&:parent_form)
  end

  def core_resource
    [CP, GBV, MRM].include?(id)
  end

  def self.cp
    find_by(unique_id: CP)
  end

  def self.gbv
    find_by(unique_id: GBV)
  end

  def self.mrm
    find_by(unique_id: MRM)
  end

  def form_section_unique_ids
    form_sections.pluck(:unique_id)
  end

  def update_with_properties(params)
    assign_attributes(params.except('form_section_unique_ids'))
    self.form_sections = FormSection.where(unique_id: params[:form_section_unique_ids])
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  def record_list_headers
    headers = {}
    headers_from_module = list_headers&.[]('case')

    headers[:case] = case unique_id
                     when CP
                       headers_from_module || CP_DEFAULT_CASE_LIST_HEADERS
                     when GBV
                       headers_from_module || GBV_DEFAULT_CASE_LIST_HEADERS
                     when MRM
                       headers_from_module || MRM_DEFAULT_CASE_LIST_HEADERS
                     else
                       headers_from_module
                     end

    headers
  end
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength

  private

  def set_unique_id
    return if unique_id.present?

    self.unique_id = "#{self.class.name}-#{name}".parameterize.dasherize
  end

  def sync_forms
    return if form_sections.blank?

    subforms = []
    form_sections.each do |form_section|
      next if form_section.is_nested

      subforms += form_section.subforms
    end

    self.form_sections = form_sections | subforms
  end
end
