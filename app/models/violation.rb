# frozen_string_literal: true

# Model for MRM Violation
class Violation < ApplicationRecord
  #TODO: For now this will be used to only read and index violations.
  #      Make similar (and test exhaustively!) to Flag model to perform reads and writes
  #TODO: There is some amount of duplication between this and the Incident container class. Refactor!
  #include CouchRest::Model::Embeddable #TODO: This is just so that Sunspot doesn't complain.
  #include Indexable

  TYPES = %w[
    killing maiming recruitment sexual_violence abduction attack_on military_use denial_humanitarian_access
  ].freeze
  MRM_ASSOCIATIONS_KEYS = %w[sources perpetrators individual_victims group_victims responses].freeze

  has_and_belongs_to_many :individual_victims
  has_and_belongs_to_many :group_victims
  has_and_belongs_to_many :perpetrators
  has_many :responses, dependent: :destroy, inverse_of: :violation
  belongs_to :source, optional: true
  belongs_to :incident

  store_accessor :data,
                 :unique_id, :violation_tally, :verified, :type

  after_initialize :set_unique_id

  # searchable do
  #   string :category, as: :category_sci

    #FormSection.violaton_forms.each do |form|
    #  #TODO: Refactor with Field: form_section.fields.where(blah) Fix with MRM
    #  # form.all_filterable_fields.map(&:name).each do |fx|
    #  #   string(fx, as: "#{fx}_sci".to_sym) {violation_value(fx)}
    #  # end
    #  # form.all_filterable_multi_fields.map(&:name).each do |f|
    #  #   string(f, multiple: true) {violation_value(f)}
    #  # end
    #  # form.all_searchable_date_fields.map(&:name).each do |f|
    #  #   date(f) {violation_value(f)}
    #  # end
    #  # form.all_filterable_numeric_fields.map(&:name).each do |f|
    #  #   integer(f) {violation_value(f)}
    #  # end
    #  # form.all_tally_fields.each do |field|
    #  #   string(field.name, multiple: true) do
    #  #     field.tally.map do |t|
    #  #       attribute = "#{field.name}_#{t}"
    #  #       value = violation_value(attribute)
    #  #       value ||= 0
    #  #       "#{t}:#{value}"
    #  #     end
    #  #   end
    #  # end
    #end

    #Incident.searchable_string_fields.each do |fx|
    #  string(fx, as: "#{fx}_sci".to_sym) {incident_value(fx)}
    #end
    #Incident.searchable_multi_fields.each do |f|
    #  string(f, multiple: true) {incident_value(f)}
    #end
    #Incident.searchable_date_fields.each do |f|
    #  date(f) {incident_value(f)}
    #end
    #Incident.searchable_numeric_fields.each do |f|
    #  integer(f) {incident_value(f)}
    #end
    #Incident.searchable_location_fields.each do |f|
    #  text(f, as: "#{f}_lngram".to_sym) {incident_value(f)}
    #end

    #string('armed_force_group_names', multiple: true){armed_force_group_names}

    #boolean('record_state') {incident_value('record_state')}

    #string('incident_total_tally', multiple: true) do
    #  types = ['boys', 'girls', 'unknown']
    #  tally = []
    #  types.each do |type|
    #    if self.incident["incident_total_tally_#{type}"].present?
    #      value = incident_value("incident_total_tally_#{type}")
    #      tally << "#{type}:#{value}"
    #    end
    #  end
    #  tally
    #end
  #end

  def set_unique_id
    self.unique_id = id
  end

  def associations_as_data
    @associations_as_data ||= {
      'sources' => source || [],
      'perpetrators' => perpetrators.map(&:data).flatten,
      'individual_victims' => individual_victims.map(&:data).flatten,
      'group_victims' => group_victims.map(&:data).flatten,
      'responses' => responses.map(&:data).flatten
    }
  end

  def associations_as_data_keys
    MRM_ASSOCIATIONS_KEYS
  end

  def self.build_record(type, data, incident)
    violation = find_or_initialize_by(id: data['unique_id'])
    violation.incident = incident
    violation.data = data
    violation.type = type
    violation
  end

  def associations_for_current_violation(associations_data)
    associations_data.select do |data|
      data['violations_ids'].include?(id)
    end
  end

  # TODO: Refactor on incident_monitoring_reporting concern
  def self.from_incident(_incident)
    []
  end

  def armed_force_group_names
    perpetrators.map(&:armed_force_group_name)
  end
end
