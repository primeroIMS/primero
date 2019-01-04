class MatchingConfiguration
  include ActiveModel::Model

  #TODO - Create rspec tests

  attr_accessor :id
  attr_accessor :form_ids
  attr_accessor :case_forms
  attr_accessor :case_form_options
  attr_accessor :case_fields
  attr_accessor :case_field_options
  attr_accessor :tracing_request_forms
  attr_accessor :tracing_request_form_options
  attr_accessor :tracing_request_fields
  attr_accessor :tracing_request_field_options
  attr_accessor :match_configuration

  ID_SEPARATOR = '::'

  class << self
    # Emulate 'find' since this isn't persisted in a DB
    def find(id, match_fields={})
      matching_configuration = MatchingConfiguration.new(id, match_fields)
      matching_configuration.load_form_fields
      matching_configuration
    end
  end

  def initialize(id=nil, match_fields={})
    @id = id || 'administration'

    @match_configuration = match_fields
    primero_module = PrimeroModule.get(PrimeroModule::CP)
    @form_ids = primero_module.try(:associated_form_ids)
  end

  def load_form_fields
    self.case_fields = load_matchable_fields_by_type('case')
    self.tracing_request_fields = load_matchable_fields_by_type('tracing_request')

    if @match_configuration.present?
      self.case_field_options = load_match_field_options_by_type('case', self.case_fields)
      self.tracing_request_field_options = load_match_field_options_by_type('tracing_request', self.tracing_request_fields)
      self.case_fields = load_potential_match_fields_by_type('case')
      self.tracing_request_fields = load_potential_match_fields_by_type('tracing_request')
    else
      self.case_field_options = load_field_options_by_type('case')
      self.tracing_request_field_options = load_field_options_by_type('tracing_request')
    end

    self.case_forms = load_matchable_forms_by_type('case')
    self.tracing_request_forms = load_matchable_forms_by_type('tracing_request')
    self.case_form_options = load_forms_by_type('case', (@match_configuration.present? ? self.case_forms : self.form_ids))
    self.tracing_request_form_options = load_forms_by_type('tracing_request', (@match_configuration.present? ? self.tracing_request_forms : self.form_ids))
  end

  def update_matchable_fields
    update_matchable('case')
    update_matchable('tracing_request')
  end

  # Filter matchable fields by form id
  def get_form_matchable_fields(type, form_key)
    fields = self.send("#{type}_fields").try(:find) { |x| x.first == form_key }
    fields.present? ? fields.last : []
  end

  # Filter field options by form id
  def get_form_field_options(type, form_key)
    fields = self.send("#{type}_field_options").try(:find) { |x| x.first == form_key }
    form_name = self.send("#{type}_form_options").try(:find) { |x| x.last == form_key }
    [fields.present? ? fields.last : [], form_name.present? ? form_name.first : '']
  end

  # Patch to make nav buttons work
  def new?
    false
  end

  private

  def load_forms_by_type(type, form_ids=self.form_ids)
    form_sections = FormSection.form_sections_by_ids_and_parent_form(form_ids, type)
    form_sections.map { |f| [f.name, f.unique_id] }
  end

  def load_matchable_forms_by_type(type)
    self.send("#{type}_fields").try(:map) { |key, _value| key }
  end

  def load_field_options_by_type(type)
    form_sections = FormSection.form_sections_by_ids_and_parent_form(self.form_ids, type)
    form_sections.map do |fs|
      [fs.unique_id, fs.fields.select { |fd| fd.visible == true }
        &.map { |fd| [fd.display_name, fs.unique_id + ID_SEPARATOR + fd.name] }]
    end
  end

  def load_matchable_fields_by_type(type)
    form_fields = FormSection.get_matchable_form_and_field_names(self.form_ids, type)
    @match_configuration.present? ? form_fields : form_fields.map { |form_key, fields| [form_key, fields.map { |val| form_key + ID_SEPARATOR + val }] }
  end

  def load_match_field_options_by_type(type, forms)
      form_sections = FormSection.form_sections_by_ids_and_parent_form(forms.keys, type)
    form_sections.map do |fs|
      [fs.unique_id, fs.fields.select {|fd| fd.visible == true && forms[fs.unique_id].include?(fd.name)}
        &.map { |fd| [fd.display_name, fd.name] }]
    end
  end

  def load_potential_match_fields_by_type(type)
    match_fields = self.match_configuration.try(:[], "#{type}_fields".to_sym) || {}
    self.send("#{type}_fields").try(:merge, match_fields) { |_k, _o, n|  n }.to_a
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
      next unless self.send("#{type}_forms").include? form_id
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
