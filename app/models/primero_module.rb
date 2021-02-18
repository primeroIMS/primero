# frozen_string_literal: true

# Configures the behavior of a module of Primero
class PrimeroModule < ApplicationRecord
  include ConfigurationRecord

  CP = 'primeromodule-cp'
  GBV = 'primeromodule-gbv'
  MRM = 'primeromodule-mrm'

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
    :user_group_filter, :use_webhooks_for, :use_webhook_sync_for
  )

  belongs_to :primero_program, optional: true
  has_and_belongs_to_many :form_sections, inverse_of: :primero_modules

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
