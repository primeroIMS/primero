class MatchingConfiguration
  include ActiveModel::Model

  #TODO - Create rspec tests

  attr_accessor :id
  attr_accessor :form_ids
  attr_accessor :case_fields
  attr_accessor :case_field_options
  attr_accessor :tracing_request_fields
  attr_accessor :tracing_request_field_options

  ID_SEPARATOR = '::'

  class << self
    # Emulate 'find' since this isn't persisted in a DB
    def find(id)
      matching_configuration = MatchingConfiguration.new(id)
      matching_configuration.load_form_fields
      matching_configuration
    end
  end

  def initialize(id=nil)
    @id = id || 'administration'

    primero_module = PrimeroModule.get(PrimeroModule::CP)
    @form_ids = primero_module.try(:associated_form_ids)
  end

  def load_form_fields
    self.case_fields = load_matchable_fields_by_type('case')
    self.case_field_options = load_field_options_by_type('case')
    self.tracing_request_fields = load_matchable_fields_by_type('tracing_request')
    self.tracing_request_field_options = load_field_options_by_type('tracing_request')
  end

  def update_matchable_fields
    update_matchable('case') if self.case_fields.present?
    update_matchable('tracing_request') if self.tracing_request_fields.present?
  end

  private

  def load_matchable_fields_by_type(type)
    matchable_field_names = FormSection.get_matchable_form_and_field_names(self.form_ids, type)
    matchable_fields = []
    matchable_field_names.each {|key, value| matchable_fields << value.map{|v| "#{key}#{ID_SEPARATOR}#{v}"}}
    matchable_fields.flatten
  end

  def load_field_options_by_type(type)
    form_sections = FormSection.form_sections_by_ids_and_parent_form(self.form_ids, type)
    form_sections&.map{|fs| [fs.description, fs.fields.select{|fd| fd.visible == true}&.map{|fd| ["#{fd.display_name} (#{fd.name})", "#{fs.unique_id}#{ID_SEPARATOR}#{fd.name}"]}]}
  end

  # Based on input, build a hash containing the forms / fields that need to be set to matchable
  # Iterate through all forms,
  #   if form field is in hash, set matchable true
  #   otherwise set matchable to false
  #
  # EXPECTS
  #    type == 'case' or 'tracing_request'
  #    case_fields and tracing_request_fields to be in format:  ["form_name::field_name", ...]
  def update_matchable(type)
    form_field_hash = {}
    self.send("#{type}_fields").try(:each) do |field_pair|
      field_pair_array = field_pair.split(ID_SEPARATOR)
      next unless field_pair_array.size == 2
      form_id = field_pair_array.first
      field_name = field_pair_array.last
      form_field_hash[form_id] = [] unless form_field_hash.has_key? form_id
      form_field_hash[form_id] << field_name
    end

    form_sections = FormSection.form_sections_by_ids_and_parent_form(self.form_ids, type)
    form_sections.each do |form_section|
      form_section.update_fields_matchable(form_field_hash[form_section.unique_id] || [])
      form_section.save
    end
  end
end