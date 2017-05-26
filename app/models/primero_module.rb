class PrimeroModule < CouchRest::Model::Base
  CP = 'primeromodule-cp'
  GBV = 'primeromodule-gbv'
  MRM = 'primeromodule-mrm'

  use_database :primero_module

  include PrimeroModel
  include Memoizable
  include Namable #delivers "name" and "description" fields

  property :program_id
  property :associated_record_types, :type => [String]
  property :associated_form_ids, :type => [String]
  property :core_resource, TrueClass, :default => false

  before_save :add_associated_subforms

  validates_presence_of :program_id, :message => I18n.t("errors.models.primero_module.program")
  validates_presence_of :associated_form_ids, :message => I18n.t("errors.models.primero_module.associated_form_ids")
  validates_presence_of :associated_record_types, :message => I18n.t("errors.models.primero_module.associated_record_types")

  class << self
    alias :old_all :all
    def all(*args)
      old_all(*args)
    end
    memoize_in_prod :all

    alias :old_get :get
    def get(*args)
      old_get(*args)
    end
    memoize_in_prod :get
  end

  def program
    PrimeroProgram.get self.program_id
  end

  def program_name
    program.name
  end

  def associated_forms(include_subforms=false)
    result = FormSection.by_unique_id(keys: self.associated_form_ids).all
    unless include_subforms
      result = result.select{|f| !f.is_nested}
    end
    return result
  end

  def associated_forms_grouped_by_record_type(include_subforms=false)
    result = {}
    forms = associated_forms(include_subforms)
    result = forms.group_by(&:parent_form) if forms.present?
    return result
  end

  def self.memoized_dependencies
    [FormSection, User, Role]
  end

  alias_method :old_core_resource, :core_resource
  def core_resource
    [CP, GBV, MRM].include?(self.id) || self.old_core_resource
  end

  def add_associated_subforms
    if self.associated_form_ids.present?
      subforms = FormSection.get_subforms(associated_forms)
      all_associated_form_ids = associated_form_ids | subforms.map(&:unique_id)
      if all_associated_form_ids.present?
        self.associated_form_ids = all_associated_form_ids
      end
    end
  end

end
