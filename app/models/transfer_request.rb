class TransferRequest < Transition

  def perform
    # TODO: record.update_last_updated_by(current_user)
    # TODO: Add alert on referrals and transfers form for record
    # TODO: Send notification email to the record owner
  end

  def accept

  end

  def reject

  end

  def consent_given? ; true ; end

  def user_can_receive?
    super && (record.owned_by == to_user_name)
  end
end