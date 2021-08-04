# frozen_string_literal: true

# Model describing a referral of a record from one user to another.
class Referral < Transition
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

  def done!(rejection_note = nil)
    return unless accepted?

    self.status = Transition::STATUS_DONE
    current_service_record = service_record
    mark_service_implemented(current_service_record)
    mark_rejection(rejection_note, current_service_record)
    remove_assigned_user
    record.save! && save!
  end

  def revoke!
    self.status = Transition::STATUS_DONE
    remove_assigned_user
    record.save! && save!
  end

  def accept!
    return unless in_progress?

    self.status = Transition::STATUS_ACCEPTED
    self.responded_at = DateTime.now
    save!
  end

  def process!(params)
    requested_status = params[:status]

    return if requested_status == status

    case requested_status
    when Transition::STATUS_REJECTED
      reject!(params[:rejected_reason])
    when Transition::STATUS_ACCEPTED
      accept!
    when Transition::STATUS_DONE
      done!(params[:rejection_note])
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
end
