class TransferRequest < Transition

  def perform
    self.status = Transition::STATUS_INPROGRESS
    record.update_last_updated_by(transitioned_by_user)
    # TODO: Add alert on referrals and transfers form for record
    record.save!
  end

  def accept!
    self.status = Transition::STATUS_ACCEPTED
    save!
    Transfer.create!(
      to_user_name: transitioned_by, transitioned_by: to_user_name,
      notes: notes, to_user_agency: to_user_agency, record: record,
      consent_overridden: consent_individual_transfer
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

  def notify_by_email
    RequestTransferJob.perform_later(id)
  end
end