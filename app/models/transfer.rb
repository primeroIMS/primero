class Transfer < Transition

  def perform
    if remote
      perform_remote_transfer
    else
      perform_system_transfer
    end
  end

  def accept
    #return unless status == Transition::STATUS_ACCEPTED

    return unless in_progress? && assigned_to_user?(user.user_name) #TODO: user????

    self.status = Transition::STATUS_ACCEPTED #TODO: but isnt this the PATCH?
    record.assigned_user_names = record.assigned_user_names.reject{|u| u == user.user_name} #TODO: Which user? to_user_name?

    record.previously_owned_by = record.owned_by
    record.owned_by = to_user_name
    record.owned_by_full_name = to_user.full_name
    # TODO: Error states
  end

  def reject
    #return unless status == Transition::STATUS_REJECTED

    return unless in_progress? && assigned_to_user?(user.user_name) #TODO: user????

    self.status = Transition::STATUS_REJECTED #TODO: but isnt this the PATCH?
    self.rejected_reason = rejected_reason #TODO: but isnt this the PATCH?

    record.assigned_user_names = record.assigned_user_names.reject{|u| u == user.user_name} #TODO: Which user? to_user_name?
    # TODO: Error states
  end

  def consent_given?
    if record.module_id == PrimeroModule::GBV
      record.consent_for_services
    elsif record.module_id == PrimeroModule::CP
      record.disclosure_other_orgs
    else
      false
    end
  end

  def user_can_receive?
    super
    # TODO: && Role can receive transfers
  end

  private

  def perform_remote_transfer
    @record.status = Record::STATUS_TRANSFERRED
    # TODO: record.save!
    # TODO: Export record with the constraints of the external user role
  end

  def perform_system_transfer
    return if to_user.nil?

    record.assigned_user_names |= [to_user_name]
    record.transfer_status = status
    record.reassigned_transferred_on = DateTime.now
    # TODO: record.save!
    # TODO: Send notification email
  end
end