# frozen_string_literal: true

# Represents a transition of record ownership  from one user to another
# without any system workflows.
class Assign < Transition
  def perform
    return if transitioned_to_user.nil?

    self.status = Transition::STATUS_DONE
    record.owned_by = transitioned_to
    record.reassigned_transferred_on = DateTime.now
    record.save!
    update_incident_ownership if record.respond_to?(:incidents)
  end

  def consent_given?
    true
  end

  def user_can_receive?
    super &&
      if transitioned_by_user.can?(:assign_within_agency, record.class)
        transitioned_to_user.agency_id == transitioned_by_user.agency_id
      elsif transitioned_by_user.can?(:assign_within_user_group, record.class)
        (transitioned_to_user.user_group_ids & transitioned_by_user.user_group_ids).present?
      elsif transitioned_by_user.can?(:assign, record.class)
        true
      else
        false
      end
  end
end
