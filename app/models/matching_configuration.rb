class MatchingConfiguration
  include ActiveModel::Model

  attr_accessor :id, :case_fields, :case_field_options, :tracing_request_fields, :tracing_request_field_options

  class << self
    def find(id)
      #TODO - anything else?   Trying to make form_for work here...
      #TODO - fetch the fields that are already flagged as matchable
      MatchingConfiguration.new(id)
    end
  end

  def initialize(id=nil)
    @id = id || 'administration'

    primero_module = PrimeroModule.get(PrimeroModule::CP)
    @case_field_options = load_form_fields_by_type('case', primero_module)
    @tracing_request_field_options = load_form_fields_by_type('tracing_request', primero_module)
  end

  private

  def load_form_fields_by_type(parent_form, primero_module)
    form_sections = FormSection.get_all_form_sections(primero_module, parent_form)
    form_sections&.map{|fs| [[fs.description, fs.unique_id], fs.fields.select{|fd| fd.visible == true}&.map{|fd| ["#{fd.display_name} (#{fd.name})", fd.name]}]}
  end
end