# frozen_string_literal: true

# Model for MRM Violation
class Violation < ApplicationRecord
  # TODO: For now this will be used to only read and index violations.
  #      Make similar (and test exhaustively!) to Flag model to perform reads and writes
  # TODO: There is some amount of duplication between this and the Incident container class. Refactor!
  # include CouchRest::Model::Embeddable #TODO: This is just so that Sunspot doesn't complain.
  # include Indexable

  TYPES = %w[killing maiming recruitment sexual_violence abduction attack_on_hospitals attack_on_schools military_use
             denial_humanitarian_access].freeze
  MRM_ASSOCIATIONS_KEYS = %w[sources perpetrators individual_victims group_victims responses].freeze
  VERIFICATION_STATUS = %w[
    verified report_pending_verification not_mrm verification_found_that_incident_did_not_occur
  ].freeze

  has_and_belongs_to_many :individual_victims
  has_and_belongs_to_many :group_victims
  has_and_belongs_to_many :perpetrators
  has_many :responses, dependent: :destroy, inverse_of: :violation
  belongs_to :source, optional: true
  belongs_to :incident

  store_accessor :data,
                 :unique_id, :violation_tally, :verified, :type, :ctfmr_verified_date, :ctfmr_verified

  after_initialize :set_unique_id

  before_save :calculate_late_verifications

  def set_unique_id
    self.unique_id = id
  end

  def associations_as_data
    @associations_as_data ||= {
      'sources' => [source&.associations_as_data],
      'perpetrators' => perpetrators.map(&:associations_as_data),
      'individual_victims' => individual_victims.map(&:associations_as_data),
      'group_victims' => group_victims.map(&:associations_as_data),
      'responses' => responses.map(&:associations_as_data)
    }
  end

  def associations_as_data_keys
    MRM_ASSOCIATIONS_KEYS
  end

  def self.build_record(type, data, incident)
    violation = find_or_initialize_by(id: data['unique_id'])
    violation.incident = incident
    violation.data = RecordMergeDataHashService.merge_data(violation.data, data)
    violation.type = type
    violation
  end

  def associations_for_current_violation(associations_data)
    associations_data.select do |data|
      data['violations_ids'].include?(id)
    end
  end

  def calculate_late_verifications
    return unless data['ctfmr_verified'] == 'verified'

    data['is_late_verification'] = late_verification?
  end

  def late_verification?
    incident_date_last_quarter? && verified_this_quarter?
  end

  def incident_date_last_quarter?
    last_quarter = Date.today - 3.month
    incident.data['incident_date'] < last_quarter.end_of_quarter
  end

  def verified_this_quarter?
    return false unless data['ctfmr_verified_date'].present?

    data['ctfmr_verified_date'].between?(Date.today.beginning_of_quarter, Date.today.end_of_quarter)
  end

  # TODO: Refactor on incident_monitoring_reporting concern
  def self.from_incident(_incident)
    []
  end

  def armed_force_group_names
    perpetrators.map(&:armed_force_group_name)
  end
end
