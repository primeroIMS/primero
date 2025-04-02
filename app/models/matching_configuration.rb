# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This governs the selection of fields that are used to match cases and traces in Primero
# rubocop:disable Metrics/ClassLength
class MatchingConfiguration
  include ActiveModel::Model

  DEFAULT_CHILD_FIELDS = %w[
    name name_nickname name_other
    sex age date_of_birth nationality ethnicity religion language
    location_last telephone_last location_birth location_current address_current
    date_of_separation separation_cause separation_cause_other
    location_before_separation location_separation
  ].freeze

  DEFAULT_INQUIRER_FIELDS = %w[
    relation relation_name relation_nickname relation_language relation_religion relation_ethnicity relation_nationality
    relation_other_family relation_telephone relation_location_current relation_address_current location_last
    telephone_last date_of_separation separation_cause separation_cause_other location_separation
  ].freeze

  # TODO: Create rspec tests
  # TODO: This is just broken. Refactor this whole class when migrating to Postgres

  attr_accessor :id, :form_ids, :case_forms, :case_form_options, :case_fields, :case_field_options,
                :tracing_request_forms, :tracing_request_form_options, :tracing_request_fields,
                :tracing_request_field_options, :match_configuration

  ID_SEPARATOR = '::'

  class << self
    # Emulate 'find' since this isn't persisted in a DB
    def find(id)
      matching_configuration = MatchingConfiguration.new(id, {})
      matching_configuration.load_form_fields
      matching_configuration
    end

    def find_for_filter(match_fields = {})
      matching_configuration = MatchingConfiguration.new(nil, match_fields)
      matching_configuration.load_fields_for_filter
      matching_configuration
    end

    def matchable_fields(record_type, from_subform = true)
      Field.joins(:form_section).includes(:form_section)
           .where(form_sections: { parent_form: record_type, is_nested: from_subform }, matchable: true)
           .order(name: :asc)
    end

    def matchable_fields_by_form(record_type, from_subform = true)
      matchable_fields(record_type, from_subform).group_by(&:form_section)
    end
  end

  def initialize(id = nil, match_fields = {})
    @id = id || 'administration'

    @match_configuration = match_fields
    primero_module = PrimeroModule.find_by(unique_id: PrimeroModule::CP)
    @form_ids = primero_module.try(:form_section_ids)
  end

  def load_common_forms(case_form_sections, tracing_request_form_sections, is_for_filter = false)
    self.case_forms = load_matchable_forms_by_type('case')
    self.tracing_request_forms = load_matchable_forms_by_type('tracing_request')

    self.case_form_options = load_form_options(case_form_sections, (is_for_filter ? case_forms : form_ids))
    self.tracing_request_form_options = load_form_options(tracing_request_form_sections,
                                                          (is_for_filter ? case_forms : form_ids))
  end

  def load_main_filters(case_form_sections, tracing_request_form_sections)
    self.case_field_options = load_field_options_for_filter(case_form_sections, case_fields)
    self.tracing_request_field_options =
      load_field_options_for_filter(tracing_request_form_sections, tracing_request_fields)

    self.case_fields = load_filter_fields_by_type('case')
    self.tracing_request_fields = load_filter_fields_by_type('tracing_request')
  end

  def load_form_fields
    case_form_sections = load_form_sections_by_type('case')
    tracing_request_form_sections = load_form_sections_by_type('tracing_request')

    self.case_fields = load_matchable_fields(case_form_sections)
    self.tracing_request_fields = load_matchable_fields(tracing_request_form_sections)

    self.case_field_options = load_field_options(case_form_sections)
    self.tracing_request_field_options = load_field_options(tracing_request_form_sections)

    load_common_forms(case_form_sections, tracing_request_form_sections, false)
  end

  def load_fields_for_filter
    case_form_sections = load_form_sections_by_type('case')
    tracing_request_form_sections = load_form_sections_by_type('tracing_request')

    self.case_fields = get_matchable_form_and_field_names(case_form_sections, 'case')
    self.tracing_request_fields = get_matchable_form_and_field_names(tracing_request_form_sections, 'tracing_request')

    load_main_filters(case_form_sections, tracing_request_form_sections)
    load_common_forms(case_form_sections, tracing_request_form_sections, true)
  end

  def update_matchable_fields
    update_matchable('case')
    update_matchable('tracing_request')
  end

  # Filter matchable fields by form id
  def get_form_matchable_fields(type, form_key)
    fields = send("#{type}_fields").try(:find) { |x| x.first == form_key }
    fields.present? ? fields.last : []
  end

  # Filter field options by form id
  def get_form_field_options(type, form_key)
    fields = send("#{type}_field_options").try(:find) { |x| x.first == form_key }
    form_name = send("#{type}_form_options").try(:find) { |x| x.last == form_key }
    [fields.present? ? fields.last : [], form_name.present? ? form_name.first : '']
  end

  # Patch to make nav buttons work
  def new?
    false
  end

  private

  def load_form_sections_by_type(type)
    forms = FormSection.where(parent_form: type, is_nested: false)
    forms = forms.where(unique_id: form_ids) if form_ids
    forms = forms.order(order_form_group: :asc, order: :asc, order_subform: :asc)
    forms.includes(:fields)
  end

  def get_matchable_form_and_field_names(form_ids, parent_form)
    matchable_fields = Field.joins(:form_section).includes(:form_section)
                            .where(form_sections: { id: form_ids, parent_form: }, matchable: true)
    grouped_matchable_fields = matchable_fields.group_by { |f| f.form_section.unique_id }
    grouped_matchable_fields.transform_values { |fields| fields.map(&:name) }
  end

  def load_matchable_fields(form_sections)
    get_matchable_form_and_field_names(form_sections).map do |form_key, fields|
      [form_key, fields.map { |val| form_key + ID_SEPARATOR + val }]
    end
  end

  def load_field_options(form_sections)
    form_sections.map do |fs|
      [fs.unique_id, fs.fields.select { |fd| fd.visible == true }
                       &.map { |fd| [fd.display_name, fs.unique_id + ID_SEPARATOR + fd.name] }]
    end
  end

  def update_form_section_for_filter(form_section, matchable_forms)
    [form_section.unique_id,
     form_section.fields.select { |fd| fd.visible == true && matchable_forms[form_section.unique_id].include?(fd.name) }
                 &.map { |fd| [fd.display_name, fd.name] }]
  end

  def load_field_options_for_filter(form_sections, matchable_forms)
    matchable_form_sections = form_sections.select { |f| matchable_forms.keys.include?(f.unique_id) }
    matchable_form_sections.map do |fs|
      update_form_section_for_filter(fs, matchable_forms)
    end
  end

  def load_filter_fields_by_type(type)
    match_fields = match_configuration.try(:[], :"#{type}_fields") || {}
    send("#{type}_fields").try(:merge, match_fields) { |_k, _o, n| n }.to_a
  end

  def load_matchable_forms_by_type(type)
    send("#{type}_fields").try(:map) { |key, _value| key }
  end

  def load_form_options(form_sections, form_ids = self.form_ids)
    form_sections.select { |f| form_ids.include?(f.unique_id) }.map { |f| [f.name, f.unique_id] }
  end

  # Based on input, build a hash containing the forms / fields that need to be set to matchable
  # Iterate through all forms,
  #   if form field is in hash, set matchable true
  #   otherwise set matchable to false
  #
  # EXPECTS
  #    type == 'case' or 'tracing_request'
  #    case_fields and tracing_request_fields to be in format:  ["form_name::field_name", ...]

  def transaction_update_matchable(form_field_hash, form_sections)
    form_sections.each do |form_section|
      matching_field_names = form_field_hash[form_section.unique_id]
      form_section.fields.each do |field|
        if matching_field_names.include?(field.name)
          field.matchable = true
          field.save
        end
      end
    end
  end

  def update_field_matchable(form_field_hash)
    send("#{type}_fields").try(:each) do |field_pair|
      next unless field_pair.split(ID_SEPARATOR).size == 2

      form_id = field_pair.split(ID_SEPARATOR).first
      field_name = field_pair.split(ID_SEPARATOR).last
      next unless send("#{type}_forms").include? form_id

      form_field_hash[form_id] = [] unless form_field_hash.key? form_id
      form_field_hash[form_id] << field_name
    end
  end

  def update_matchable(type)
    form_field_hash = {}
    update_field_matchable(form_field_hash, field_pair)
    ActiveRecord::Base.transaction do
      transaction_update_matchable(form_field_hash, load_form_sections_by_type(type))
    end
  end
end
# rubocop:enable Metrics/ClassLength
