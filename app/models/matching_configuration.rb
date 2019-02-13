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
    def find(id)
      matching_configuration = MatchingConfiguration.new(id, {})
      matching_configuration.load_form_fields
      matching_configuration
    end

    def find_for_filter(match_fields={})
      matching_configuration = MatchingConfiguration.new(nil, match_fields)
      matching_configuration.load_fields_for_filter
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
    case_form_sections = load_form_sections_by_type('case')
    tracing_request_form_sections = load_form_sections_by_type('tracing_request')

    self.case_fields = load_matchable_fields(case_form_sections)
    self.tracing_request_fields = load_matchable_fields(tracing_request_form_sections)

    self.case_field_options = load_field_options(case_form_sections)
    self.tracing_request_field_options = load_field_options(tracing_request_form_sections)

    self.case_forms = load_matchable_forms_by_type('case')
    self.tracing_request_forms = load_matchable_forms_by_type('tracing_request')

    self.case_form_options = load_form_options(case_form_sections, self.form_ids)
    self.tracing_request_form_options = load_form_options(tracing_request_form_sections, self.form_ids)
  end

  def load_fields_for_filter
    case_form_sections = load_form_sections_by_type('case')
    tracing_request_form_sections = load_form_sections_by_type('tracing_request')

    self.case_fields = get_matchable_form_and_field_names(case_form_sections)
    self.tracing_request_fields = get_matchable_form_and_field_names(tracing_request_form_sections)

    self.case_field_options = load_field_options_for_filter(case_form_sections, self.case_fields)
    self.tracing_request_field_options = load_field_options_for_filter(tracing_request_form_sections, self.tracing_request_fields)

    #TODO: It kinda stinks that we are overwriting case_fields & tracing_request fields.
    #TODO: Is there a better way to do this?
    self.case_fields = load_filter_fields_by_type('case')
    self.tracing_request_fields = load_filter_fields_by_type('tracing_request')

    self.case_forms = load_matchable_forms_by_type('case')
    self.tracing_request_forms = load_matchable_forms_by_type('tracing_request')

    self.case_form_options = load_form_options(case_form_sections, self.case_forms)
    self.tracing_request_form_options = load_form_options(tracing_request_form_sections, self.tracing_request_forms)
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

  def load_form_sections_by_type(type)
    FormSection.form_sections_by_ids_and_parent_form(self.form_ids, type)
  end

  # Returns: hash of (key) Form ID and (values) Fields that are matchable
  def get_matchable_form_and_field_names(form_sections)
    return {} if form_sections.blank?
    form_hash = {}
    form_sections.each do |f|
      matchable_fields = f.all_matchable_fields
      form_hash[f.unique_id] = matchable_fields.map{|fd| fd.name} if matchable_fields.present?
    end
    form_hash
  end

  def load_matchable_fields(form_sections)
    get_matchable_form_and_field_names(form_sections).map { |form_key, fields| [form_key, fields.map { |val| form_key + ID_SEPARATOR + val }] }
  end

  def load_field_options(form_sections)
    form_sections.map do |fs|
      [fs.unique_id, fs.fields.select { |fd| fd.visible == true }
      &.map { |fd| [fd.display_name, fs.unique_id + ID_SEPARATOR + fd.name] }]
    end
  end

  def load_field_options_for_filter(form_sections, matchable_forms)
    matchable_form_sections = form_sections.select{|f| matchable_forms.keys.include?(f.unique_id)}
    matchable_form_sections.map do |fs|
      [fs.unique_id, fs.fields.select {|fd| fd.visible == true && matchable_forms[fs.unique_id].include?(fd.name)}
      &.map { |fd| [fd.display_name, fd.name] }]
    end
  end

  def load_filter_fields_by_type(type)
    match_fields = self.match_configuration.try(:[], "#{type}_fields".to_sym) || {}
    self.send("#{type}_fields").try(:merge, match_fields) { |_k, _o, n|  n }.to_a
  end

  def load_matchable_forms_by_type(type)
    self.send("#{type}_fields").try(:map) { |key, _value| key }
  end

  def load_form_options(form_sections, form_ids=self.form_ids)
    form_sections.select{|f| form_ids.include?(f.unique_id)}.map{|f| [f.name, f.unique_id]}
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

    form_sections = load_form_sections_by_type(type)
    form_sections.each do |form_section|
      form_section.update_fields_matchable(form_field_hash[form_section.unique_id] || [])
      form_section.save
    end
  end
end
