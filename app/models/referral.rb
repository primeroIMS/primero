class Referral < Transition

  def perform
    self.status = Transition::STATUS_INPROGRESS
    mark_service_object_referred
    if remote
      perform_remote_referral
    else
      perform_system_referral
    end
  end

  def reject!
    self.status = Transition::STATUS_DONE
    return if record.referrals.where(to_user_name: to_user_name).nil?

    if record.assigned_user_names.present?
      record.assigned_user_names.delete(to_user_name)
    end
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
    super && to_user.can?(:receive_referral, record.class)
  end

  private

  def mark_service_object_referred
    if service_record_id.present?
      service_object = record.services_section.select {|s| s.unique_id == service_record_id}.first
      service_object['service_status_referred'] = true if service_object.present?
    end
  end

  def perform_system_referral
    return if to_user.nil?

    if record.assigned_user_names.present?
      record.assigned_user_names |= [to_user_name]
    else
      record.assigned_user_names = [to_user_name]
    end
    record.save!
  end

  def perform_remote_referral
    # TODO: Make sure that only this referral object will be visible in the export
    # TODO: Export record with the constraints of the external user role
  end

end