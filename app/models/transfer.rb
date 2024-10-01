# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# The business logic for performing the record transfer workflow.
class Transfer < Transition
  include TransitionAlertable

  TRANSFER_FORM_UNIQUE_ID = 'transfers_assignments'
  TRANSFER_ALERT_TYPE = 'transfer'
  NOTIFICATION_ACTION = 'transfer_request'

  class << self
    def alert_form_unique_id
      TRANSFER_FORM_UNIQUE_ID
    end

    def alert_type
      TRANSFER_ALERT_TYPE
    end
  end

  def perform
    self.status = Transition::STATUS_INPROGRESS
    if remote
      perform_remote_transfer
    else
      perform_system_transfer
    end
  end

  def accept!(user)
    return unless in_progress?

    self.status = record.transfer_status = Transition::STATUS_ACCEPTED
    self.responded_at = DateTime.now
    remove_assigned_user
    record.owned_by = transitioned_to
    record.update_last_updated_by(user)
    save!
    update_incident_ownership
  end

  def reject!(user)
    return unless in_progress?

    self.status = record.transfer_status = Transition::STATUS_REJECTED
    self.responded_at = DateTime.now

    remove_assigned_user
    record.update_last_updated_by(user)
    save!
  end

  def revoke!(user)
    self.status = record.transfer_status = Transition::STATUS_REVOKED
    remove_assigned_user
    record.update_last_updated_by(user)
    save!
  end

  def consent_given?
    case record.module_id
    when PrimeroModule::GBV
      record.consent_for_services
    else
      record.disclosure_other_orgs
    end
  end

  def user_can_accept_or_reject?(user)
    return false if !in_progress? || user.user_name == transitioned_by
    return true if user.user_name == transitioned_to

    user.can?(:accept_or_reject_transfer, Child) && user.managed_user_names.include?(transitioned_to)
  end

  def generate_alert?
    super && record.current_alert_types.exclude?(self.class.alert_type)
  end

  private

  def perform_remote_transfer
    # TODO: Export record with the constraints of the external user role
    record.status = Record::STATUS_TRANSFERRED
  end

  def perform_record_system_transfer
    if record.assigned_user_names.present?
      record.assigned_user_names |= [transitioned_to]
    else
      record.assigned_user_names = [transitioned_to]
    end
    record.transfer_status = status
    record.reassigned_transferred_on = DateTime.now
  end

  def perform_system_transfer
    return if transitioned_to_user.nil?

    perform_record_system_transfer
    record.last_updated_by = transitioned_by
  end
end
