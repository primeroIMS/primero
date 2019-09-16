class TransferRequest < Transition

  def perform
    self.status = Transition::STATUS_INPROGRESS
    record.update_last_updated_by(transitioned_by_user)
    # TODO: Add alert on referrals and transfers form for record
    record.save!
    # TODO: Send notification email to the record owner
  end

  def accept!
    self.status = Transition::STATUS_ACCEPTED
    save!
    # TODO: How do we handle consent for the transfer from the beneficiary?
    Transfer.create!(
      to_user_name: transitioned_by, transitioned_by: to_user_name,
      notes: notes, to_user_agency: to_user_agency, record: record
    )
  end

  def reject!
    self.status = Transition::STATUS_REJECTED
    save!
  end

  def consent_given? ; true ; end

  def user_can_receive?
    super && (record.owned_by == to_user_name)
  end
end