module Transitionable
  extend ActiveSupport::Concern

  included do
    #TODO: This will need to be changed toi individual associations per type?
    has_many :transitions, as: :record

    store_accessor :data,
      :transfer_status, :reassigned_transferred_on

    searchable auto_index: self.auto_index? do
      string :transfer_status, as: 'transfer_status_sci'
      string :referred_users, multiple: true
      string :transferred_to_users, multiple: true
      time :reassigned_transferred_on
    end

    def transitions_transfer_status(transfer_id, transfer_status, user, rejected_reason)
      if transfer_status == Transition::STATUS_ACCEPTED ||
         transfer_status == Transition::STATUS_REJECTED
        #Retrieve the transfer that user accept/reject.
        transfer = self.transfers.select{|t| t.id == transfer_id }.first
        if transfer.present?
          #Validate that the transitions is in progress and the user is related to.
          if transfer.in_progress? && transfer.assigned_to_user?(user.user_name)
            #Change Status according the action executed.
            transfer.status = transfer_status
            #When is a reject action, there could be a reason.
            if rejected_reason.present?
              transfer.rejected_reason = rejected_reason
            end
            #Update the top level transfer status.
            self.transfer_status = transfer_status
            #Either way Accept or Reject the current user should be removed from the associated users.
            #So, it will have no access to the record anymore.
            self.assigned_user_names = self.assigned_user_names.reject{|u| u == user.user_name}
            if transfer_status == Transition::STATUS_ACCEPTED
              #In case the transfer is accepted the current user is the new owner of the record.
              self.previously_owned_by = self.owned_by
              self.owned_by = user.user_name
              self.owned_by_full_name = user.full_name
            end
            #let know the caller the record was changed.
            status_changed = :transition_transfer_status_updated
          else
            status_changed = :transition_not_valid_transfer
          end
        else
          status_changed = :transition_unknown_transfer
        end
      else
        status_changed = :transition_unknown_transfer_status
      end
      status_changed
    end

    def send_transition_email(transition_type, host_url)
      TransitionNotifyJob.perform_later(transition_type, self.class.to_s, self.id, self.transitions.first.try(:id), host_url)
    end

    def send_request_transfer_email(user_id, request_transfer_notes, host_url)
      RequestTransferJob.perform_later(self.class.to_s, self.id, user_id, request_transfer_notes, host_url) if self.owner&.email.present?
    end
  end

  EXPORT_TYPE_PRIMERO = 'primero'
  EXPORT_TYPE_NON_PRIMERO = 'non_primero'
  EXPORT_TYPE_PDF = 'pdf_export'

  def assigns
    transitions.where(type: Assign.name)
  end

  def referrals
    transitions.where(type: Referral.name)
  end

  def referred_users
    self.transitions.map{|er| [er.to_user_name, er.to_user_remote]}.flatten.compact.uniq
  end

  def set_service_as_referred( service_object_id )
    if service_object_id.present?
      service_object = self.services_section.select {|s| s.unique_id == service_object_id}.first
      service_object['service_status_referred'] = true
    end
  end

  def transfers
    transitions.where(type: Transfer.name)
  end

  def transition_by_type_and_id(type, id)
    self.transitions.select{|t| t.type == type && t.id == id}.first
  end

  def transferred_to_users
    self.transitions.select(&:in_progress?)
        .map(&:to_user_name).uniq
  end

  def has_referrals
    self.referrals.present?
  end
  alias :has_referrals? :has_referrals

  def reject_old_transitions
    self.transitions = [self.transitions.first]
  end

  def latest_external_referral
    referral = []
    transitions = self.transitions
    if transitions.present?
      ext_referrals = transitions.select do |transition|
        transition.type == Transition::REFERRAL && transition.is_remote
      end
      if ext_referrals.present?
        # Expected result is either one or zero element array
        referral = [ext_referrals.first]
      end
    end
    referral
  end

  def given_consent(type = Transition::REFERRAL)
    if self.module_id == PrimeroModule::GBV
      self.consent_for_services == true
    elsif self.module_id == PrimeroModule::CP
      if type == Transition::REFERRAL
        self.disclosure_other_orgs == true && self.consent_for_services == true
      else
        self.disclosure_other_orgs == true
      end
    end
  end

end
