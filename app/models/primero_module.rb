class PrimeroModule < ApplicationRecord
  CP = 'primeromodule-cp'
  GBV = 'primeromodule-gbv'
  MRM = 'primeromodule-mrm'

  store_accessor :module_options, :allow_searchable_ids, :selectable_approval_types,
    :workflow_status_indicator, :agency_code_indicator, :use_workflow_service_implemented,
    :use_workflow_case_plan, :use_workflow_assessment, :reporting_location_filter,
    :user_group_filter

  belongs_to :primero_program

  has_and_belongs_to_many :form_sections

  validates_presence_of :primero_program_id, :message => I18n.t("errors.models.primero_module.program")
  validates_presence_of :form_sections, :message => I18n.t("errors.models.primero_module.form_section_ids")
  validates_presence_of :associated_record_types, :message => I18n.t("errors.models.primero_module.associated_record_types")

  def program_name
    primero_program.try(:name)
  end

  def associated_forms(include_subforms=false)
    result = self.form_sections
    result.each{|f| f.module_name = self.name}

    unless include_subforms
      result = result.select{ |f| !f.is_nested }
    end

    result
  end

  def associated_forms_grouped_by_record_type(include_subforms=false)
    forms = associated_forms(include_subforms)
    return {} if forms.blank?
    forms.each{ |f| f.module_name = self.name }
    forms.group_by(&:parent_form)
  end

  # def self.memoized_dependencies
  #   [FormSection, User, Role]
  # end

  def core_resource
    [CP, GBV, MRM].include?(self.id)
  end

  def field_map_to_module_id
    self.field_map.present? ? self.field_map['map_to'] : nil
  end

  def field_map_to_module
    if self.field_map_to_module_id.present?
      @field_map_to_module ||= PrimeroModule.find_by(unique_id: self.field_map_to_module_id)
    end
    return @field_map_to_module
  end

  def field_map_fields
    self.field_map.present? ? self.field_map['fields'] : nil
  end

  def self.cp
    find_by(unique_id: CP)
  end

  def self.gbv
    find_by(unique_id: GBV)
  end
end
