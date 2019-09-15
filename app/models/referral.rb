class Referral < Transition

  def perform
    mark_service_object_referred
    if remote
      perform_remote_referral
    else
      perform_system_referral
    end
  end

  def reject
    # TODO: Unless there are other referrals assigned to you for this record, lose access to this case
  end

  def consent_given?
    if record.module_id == PrimeroModule::GBV
      record.consent_for_services
    elsif self.module_id == PrimeroModule::CP
      record.disclosure_other_orgs && record.consent_for_services
    else
      false
    end
  end

  def user_can_receive?
    super
    # TODO: && Role can receive referrals
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

    record.assigned_user_names |= [ to_user_name ]
    # TODO: record.save
    # TODO: Send notification email
  end

  def perform_remote_referral
    # TODO: Make sure that only this referral will be visible in the export
    # TODO: Export record with the constraints of the external user role
  end

end