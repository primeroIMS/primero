class Transfer < Transition

  def perform
    self.status = Transition::STATUS_INPROGRESS
    if remote
      perform_remote_transfer
    else
      perform_system_transfer
    end
  end

  def accept!
    return unless in_progress?

    self.status = record.status = Transition::STATUS_ACCEPTED
    remove_assigned_user

    record.previously_owned_by = record.owned_by
    record.owned_by = to_user_name
    record.owned_by_full_name = to_user.full_name
    record.save! && save!
  end

  def reject!
    return unless in_progress?

    self.status = record.status = Transition::STATUS_REJECTED

    remove_assigned_user
    record.save! && save!
  end

  def consent_given?
    case record.module_id
    when PrimeroModule::GBV
      record.consent_for_services
    when PrimeroModule::CP
      record.disclosure_other_orgs
    else
      false
    end
  end

  def user_can_receive?
    super && to_user.can?(:receive_transfer, record.class)
  end

  private

  def perform_remote_transfer
    record.status = Record::STATUS_TRANSFERRED
    record.save!
    # TODO: Export record with the constraints of the external user role
  end

  def perform_system_transfer
    return if to_user.nil?

    if record.assigned_user_names.present?
      record.assigned_user_names |= [to_user_name]
    else
      record.assigned_user_names = [to_user_name]
    end
    record.transfer_status = status
    record.reassigned_transferred_on = DateTime.now
    record.save!
  end

  def remove_assigned_user
    if record.assigned_user_names.present?
      record.assigned_user_names.delete(to_user_name)
    end
  end

end