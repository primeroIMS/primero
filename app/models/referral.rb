# frozen_string_literal: true

# rubocop:disable Metrics/ClassLength
# Model describing a referral of a record from one user to another.
class Referral < Transition
  include TransitionAlertable

  REFERRAL_SUCCESSFUL = 'successful'
  REFERRAL_NOT_SUCCESSFUL = 'not_successful'
  REFERRAL_FORM_UNIQUE_ID = 'referral'
  REFERRAL_ALERT_TYPE = 'referral'
  REFERRAL_STATUSES = [
    Transition::STATUS_INPROGRESS, Transition::STATUS_REJECTED, Transition::STATUS_REVOKED,
    Transition::STATUS_ACCEPTED, Transition::STATUS_DONE
  ].freeze
  REFERRAL_SUCCESS_STATUSES = [REFERRAL_SUCCESSFUL, REFERRAL_NOT_SUCCESSFUL].freeze
  REASON_NOT_SUCCESSFUL_DEFAULT_VALUES = %w[
    client_refused_services lack_of_capacity other services_no_longer_needed
    unable_to_contact_client unable_to_contact_referred_to_organization
  ].freeze
  SERVICE_IMPLEMENTED_DEFAULT_VALUES = [Serviceable::SERVICE_IMPLEMENTED, Serviceable::SERVICE_NOT_IMPLEMENTED].freeze

  store_accessor(
    :data, :service_implementing_agency_registry_id, :success_status, :reason_not_successful, :service_implemented
  )

  scope :active_for_user, lambda { |user_name, record_ids, record_type|
    where(
      record_id: record_ids,
      record_type: record_type,
      type: name,
      transitioned_to: user_name,
      status: [Transition::STATUS_INPROGRESS, Transition::STATUS_ACCEPTED]
    )
  }

  validate :validate_success_status
  validate :validate_reason_not_successful
  validate :validate_service_implemented

  class << self
    def alert_form_unique_id
      REFERRAL_FORM_UNIQUE_ID
    end

    def alert_type
      REFERRAL_ALERT_TYPE
    end

    def schema_for_update
      {
        'status' => { 'type' => 'string', 'enum' => REFERRAL_STATUSES },
        'rejection_note' => { 'type' => %w[string null] },
        'rejected_reason' => { 'type' => %w[string null] },
        'success_status' => {
          'anyOf' => [{ 'type' => 'string', 'enum' => REFERRAL_SUCCESS_STATUSES }, { 'type' => 'null' }]
        }
      }.merge(schema_with_permitted_values(permitted_values_for_update))
    end

    private

    def schema_with_permitted_values(permitted_values)
      reason_values = permitted_values['reason_not_successful'].presence || REASON_NOT_SUCCESSFUL_DEFAULT_VALUES
      implemented_values = permitted_values['service_implemented'].presence || SERVICE_IMPLEMENTED_DEFAULT_VALUES
      {
        'reason_not_successful' => {
          'anyOf' => [{ 'type' => 'string', 'enum' => reason_values }, { 'type' => 'null' }]
        },
        'service_implemented' => {
          'anyOf' => [{ 'type' => 'string', 'enum' => implemented_values }, { 'type' => 'null' }]
        }
      }
    end

    def permitted_values_for_update
      PermittedFieldValuesService.instance.permitted_field_values(
        [reason_not_successful_field, service_implemented_field]
      )
    end

    def reason_not_successful_field
      Field.new(
        name: 'reason_not_successful',
        type: Field::SELECT_BOX,
        option_strings_source: 'lookup lookup-reasons-referral-failure'
      )
    end

    def service_implemented_field
      Field.new(
        name: 'service_implemented',
        type: Field::SELECT_BOX,
        option_strings_source: Field.joins(:form_section)
          .where(name: 'service_implemented', form_section: { is_nested: true })
          .pick(:option_strings_source)
      )
    end
  end

  def perform
    self.status = Transition::STATUS_INPROGRESS
    mark_service_referred(service_record)
    perform_system_referral unless remote
    record.last_updated_by = transitioned_by
  end

  def reject!(user, rejected_reason = nil)
    return unless in_progress?

    self.status = Transition::STATUS_REJECTED
    self.rejected_reason = rejected_reason
    self.responded_at = DateTime.now
    remove_assigned_user
    record.update_last_updated_by(user)
    save!
  end

  def done!(user, params)
    return unless accepted?

    self.status = Transition::STATUS_DONE
    self.data = data.merge(params.slice(:service_implemented, :success_status, :reason_not_successful))
    current_service_record = service_record
    mark_service_implemented(current_service_record)
    mark_rejection(params[:rejection_note], current_service_record)
    remove_assigned_user
    record.update_last_updated_by(user)
    save!
  end

  def revoke!(user)
    self.status = Transition::STATUS_REVOKED
    remove_assigned_user
    record.update_last_updated_by(user)
    save!
  end

  def accept!
    return unless in_progress?

    self.status = Transition::STATUS_ACCEPTED
    self.responded_at = DateTime.now
    save!
  end

  def process!(user, params)
    requested_status = params[:status]

    return if requested_status == status

    case requested_status
    when Transition::STATUS_REJECTED
      reject!(user, params[:rejected_reason])
    when Transition::STATUS_ACCEPTED
      accept!
    when Transition::STATUS_DONE
      done!(user, params)
    end
  end

  def consent_given?
    case record.module_id
    when PrimeroModule::GBV
      record.consent_for_services
    else
      record.disclosure_other_orgs && record.consent_for_services
    end
  end

  def alerts_to_delete
    super.select { |alert| alert.user.user_name == transitioned_to_user.user_name }
  end

  private

  def mark_rejection(rejection_note, service_object = nil)
    return unless rejection_note.present?

    self.rejection_note = rejection_note
    service_object['note_on_referral_from_provider'] = rejection_note if service_object.present?
  end

  def mark_service_referred(service_object)
    return if service_object.blank?

    service_object['service_status_referred'] = true
  end

  def mark_service_implemented(service_object)
    return unless service_object.present?

    if service_implemented == Serviceable::SERVICE_IMPLEMENTED &&
       service_object['service_implemented_day_time'].blank?
      service_object['service_implemented_day_time'] = Time.zone.now.as_json
    end

    service_object['service_implemented'] = service_implemented
  end

  def service_record
    return if service_record_id.blank?

    record.services_section.find { |service| service['unique_id'] == service_record_id }
  end

  def perform_system_referral
    return if transitioned_to_user.nil?

    if record.assigned_user_names.present?
      record.assigned_user_names |= [transitioned_to]
    else
      record.assigned_user_names = [transitioned_to]
    end
  end

  def validate_success_status
    return unless status == Transition::STATUS_DONE && success_status.blank?

    errors.add(:base, 'errors.models.referral.success_status_present')
  end

  def validate_reason_not_successful
    return unless status == Transition::STATUS_DONE && success_status == REFERRAL_NOT_SUCCESSFUL &&
                  reason_not_successful.blank?

    errors.add(:base, 'errors.models.referral.reason_not_successful_present')
  end

  def validate_service_implemented
    return unless status == Transition::STATUS_DONE
    return unless service_record.present? && service_implemented.blank?

    errors.add(:base, 'errors.models.referral.service_implemented_present')
  end
end
# rubocop:enable Metrics/ClassLength
