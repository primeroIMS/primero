class PrimeroModule < ApplicationRecord
  include Configuration

  CP = 'primeromodule-cp'
  GBV = 'primeromodule-gbv'
  MRM = 'primeromodule-mrm'

  store_accessor :module_options, :allow_searchable_ids, :selectable_approval_types,
    :workflow_status_indicator, :agency_code_indicator, :use_workflow_service_implemented,
    :use_workflow_case_plan, :use_workflow_assessment, :reporting_location_filter,
    :user_group_filter

  belongs_to :primero_program

  has_and_belongs_to_many :users
  has_and_belongs_to_many :form_sections, inverse_of: :primero_modules

  validates :name, presence: { message: I18n.t("errors.models.primero_module.name_present") },
                   uniqueness: { message: I18n.t("errors.models.primero_module.unique_name") }
  validates_presence_of :primero_program_id, :message => I18n.t("errors.models.primero_module.program")
  validates_presence_of :form_sections, :message => I18n.t("errors.models.primero_module.form_section_ids")
  validates_presence_of :associated_record_types, :message => I18n.t("errors.models.primero_module.associated_record_types")

  before_create :set_unique_id

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

  def self.mrm
    find_by(unique_id: MRM)
  end

  class << self

    alias super_clear clear
    def clear
      self.all.each do |pm|
        pm.users.destroy(pm.users)
      end
      super_clear
    end

    alias super_import import
    def import(data)
      data['form_sections'] = FormSection.where(unique_id: data['form_sections']) if data['form_sections'].present?
      data['primero_program_id'] = PrimeroProgram.find_by(unique_id: data['primero_program_id']).id if data['primero_program_id'].present?
      super_import(data)
    end

    def export
      self.all.map do |record|
        record.attributes.tap do |pm|
          pm.delete('id')
          pm['form_sections'] = record.form_sections.pluck(:unique_id)
          pm['primero_program_id'] = record.primero_program.unique_id
        end
      end
    end
  end

  private

  def set_unique_id
    unless self.unique_id.present?
      self.unique_id = "#{self.class.name}-#{self.name}".parameterize.dasherize
    end
  end
end
