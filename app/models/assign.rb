# frozen_string_literal: true

# Represents a transition of record ownership  from one user to another
# without any system workflows.
class Assign < Transition
  def perform
    return if transitioned_to_user.nil?

    self.status = Transition::STATUS_DONE
    record.owned_by = transitioned_to
    record.reassigned_transferred_on = DateTime.now
    record.update_last_updated_by(transitioned_by_user)
    record.save!
    update_incident_ownership
  end

  def consent_given?
    true
  end

  def notified_statuses
    [Transition::STATUS_DONE]
  end
end
