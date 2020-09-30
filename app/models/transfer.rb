# frozen_string_literal: true

# The business logic for performing the record transfer workflow.
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

    self.status = record.transfer_status = Transition::STATUS_ACCEPTED
    remove_assigned_user
    record.owned_by = transitioned_to
    record.save! && save!
    update_incident_ownership
  end

  def reject!
    return unless in_progress?

    self.status = record.transfer_status = Transition::STATUS_REJECTED

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
    super && transitioned_to_user.can?(:receive_transfer, record.class)
  end

  private

  def perform_remote_transfer
    record.status = Record::STATUS_TRANSFERRED
    record.save!
    # TODO: Export record with the constraints of the external user role
  end

  def perform_system_transfer
    return if transitioned_to_user.nil?

    if record.assigned_user_names.present?
      record.assigned_user_names |= [transitioned_to]
    else
      record.assigned_user_names = [transitioned_to]
    end
    record.transfer_status = status
    record.reassigned_transferred_on = DateTime.now
    record.save!
  end

  def remove_assigned_user
    record.assigned_user_names.delete(transitioned_to) if record.assigned_user_names.present?
  end
end
