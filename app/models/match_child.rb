class MatchChild < CouchRest::Model::Base
  use_database :match_child

  CHILD_PREFERENCE_MAX = 3

  def self.parent_form
    'case'
  end

  def locale_prefix
    'case'
  end

  include PrimeroModel
  include Primero::CouchRestRailsBackward

  # This module updates photo_keys with the before_save callback and needs to
  # run before the before_save callback in Historical to make the history
  include PhotoUploader
  include Record
  include DocumentUploader

  include Ownable
  include Matchable
  include AudioUploader

  FORM_NAME = 'case'

  property :case_id
  property :case_id_code
  property :case_id_display
  property :nickname
  property :name
  property :hidden_name, TrueClass, :default => false
  property :registration_date, Date
  property :reunited, TrueClass
  property :reunited_message, String
  property :investigated, TrueClass
  property :verified, TrueClass
  property :risk_level
  property :child_status
  property :system_generated_followup, TrueClass, default: false
  property :registration_date, Date
  #To hold the list of GBV Incidents created from a GBV Case.
  property :incident_links, [String], :default => []

  # validate :validate_has_at_least_one_field_value
  validate :validate_date_of_birth
  validate :validate_child_wishes
  # validate :validate_date_closure

  before_save :sync_protection_concerns

  def initialize *args
    self['photo_keys'] ||= []
    self['document_keys'] ||= []
    arguments = args.first

    if arguments.is_a?(Hash) && arguments["current_photo_key"]
      self['current_photo_key'] = arguments["current_photo_key"]
      arguments.delete("current_photo_key")
    end

    self['histories'] = []

    super *args
  end

  def self.quicksearch_fields
    []
  end

  def self.form_matchable_fields
    form_fields = FormSection.get_matchable_fields_by_parent_form(FORM_NAME, false)
    Array.new(form_fields).map(&:name)
  end

  def self.subform_matchable_fields
    form_fields = FormSection.get_matchable_fields_by_parent_form(FORM_NAME)
    Array.new(form_fields).map(&:name)
  end

  def self.matchable_fields
    form_matchable_fields.concat(subform_matchable_fields)
  end

  include Searchable
  include Flaggable
  include Transitionable

  searchable do
    form_matchable_fields.select{|field| Record.exclude_match_field(field)}.each { |field| text field, :boost => Record.get_field_boost(field)}

    subform_matchable_fields.select{|field| Record.exclude_match_field(field)}.each do |field|
      text field, :boost => Record.get_field_boost(field) do
        self.family_details_section.map{|fds| fds[:"#{field}"]}.compact.uniq.join(' ') if self.try(:family_details_section)
      end
    end

    string :id do
      self['_id']
    end

  end

  def self.save_new_record(child)
    attributes = {}
    form_matchable_fields.each { |field| attributes.merge!(:"#{field}" => child.try(:"#{field}")) }
    attributes.merge!(:family_details_section => child.try(:family_details_section))
    attributes.select!{|key, value| !(value.nil? || (value.empty? if value.is_a? Array))}
    match_child = MatchChild.new
    match_child.update_attributes(attributes).id
  end

  def self.delete_record(match_child_id)
    match_child = by_id(:key => match_child_id).first
    match_child.destroy unless match_child.nil?
  end

end
