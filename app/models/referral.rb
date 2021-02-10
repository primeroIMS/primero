# frozen_string_literal: true

# Model describing a referral of a record from one user to another.
class Referral < Transition
  after_save :reset_service_record

  def perform
    self.status = Transition::STATUS_INPROGRESS
    mark_service_referred(service_record)
    perform_system_referral unless remote
    record.save! if record.has_changes_to_save?
  end

  def reject!(rejected_reason = nil)
    return unless in_progress?

    self.status = Transition::STATUS_REJECTED
    self.rejected_reason = rejected_reason
    self.responded_at = DateTime.now
    remove_assigned_user
    record.save! && save!
  end

  def finish!(rejection_note = nil)
    self.status = Transition::STATUS_DONE
    mark_rejection(rejection_note, service_record)
    mark_service_implemented(service_record)
    remove_assigned_user
    record.save! && save!
  end

  def accept!
    return unless in_progress?

    self.status = Transition::STATUS_ACCEPTED
    self.responded_at = DateTime.now
    save!
  end

  def accept_or_reject!(requested_status, rejected_reason = nil)
    return if requested_status == status

    case requested_status
    when Transition::STATUS_REJECTED
      reject!(rejected_reason)
    when Transition::STATUS_ACCEPTED
      accept!
    end
  end

  def consent_given?
    case record.module_id
    when PrimeroModule::GBV
      record.consent_for_services
    when PrimeroModule::CP
      record.disclosure_other_orgs && record.consent_for_services
    else
      false
    end
  end

  def user_can_receive?
    super && transitioned_to_user.can?(:receive_referral, record.class)
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

    if service_object['service_implemented_day_time'].blank?
      service_object['service_implemented_day_time'] = Time.zone.now.as_json
    end

    service_object['service_implemented'] = Serviceable::SERVICE_IMPLEMENTED
  end

  def service_record
    return if service_record_id.blank?

    @service_record ||= record.services_section.find { |service| service['unique_id'] == service_record_id }
  end

  def perform_system_referral
    return if transitioned_to_user.nil?

    if record.assigned_user_names.present?
      record.assigned_user_names |= [transitioned_to]
    else
      record.assigned_user_names = [transitioned_to]
    end
  end

  def reset_service_record
    @service_record = nil
  end
end
