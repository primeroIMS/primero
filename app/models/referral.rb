# frozen_string_literal: true

# Model describing a referral of a record from one user to another.
class Referral < Transition
  def perform
    self.status = Transition::STATUS_INPROGRESS
    mark_service_object_referred(service_record_object)
    perform_system_referral unless remote
    record.save! if record.has_changes_to_save?
  end

  def reject!
    self.status = Transition::STATUS_DONE
    mark_service_object_implemented(service_record_object)
    record.assigned_user_names.delete(transitioned_to) if record.assigned_user_names.present?
    record.save! && save!
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

  def mark_service_object_referred(service_object)
    return if service_object.blank?

    service_object['service_status_referred'] = true
  end

  def mark_service_object_implemented(service_object)
    return if service_object.blank?

    service_object['service_implemented_day_time'] = Time.zone.now.as_json
    service_object['service_implemented'] = Serviceable::SERVICE_IMPLEMENTED
  end

  def service_record_object
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
