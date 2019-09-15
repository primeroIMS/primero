class Assign < Transition

  def perform
    return if to_user.nil?

    record.previously_owned_by = record.owned_by
    record.owned_by = to_user_name
    record.owned_by_full_name = to_user.full_name
    record.reassigned_transferred_on = DateTime.now
    record.save!
  end

  def consent_given? ; true ; end

  def user_can_receive?
    super &&
      if transitioned_by_user.can?(:assign_within_agency, record.class)
        to_user.agency_id == transitioned_by_user.agency_id
      elsif transitioned_by_user.can?(:assign_within_user_group, record.class)
        (to_user.user_group_ids & transitioned_by_user.user_group_ids).present?
      elsif transitioned_by_user.can?(:assign, record.class)
        true
      else
        false
      end
  end

end