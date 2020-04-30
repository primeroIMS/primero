module Transitionable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  included do
    property :transfer_status, String
    property :transitions, [Transition], :default => []
    property :reassigned_tranferred_on, DateTime


    def add_transition(transition_type, to_user_local, to_user_remote, to_user_agency, to_user_local_status, notes,
                       is_remote, type_of_export, user_name, consent_overridden,
                       consent_individual_transfer=false, service = "", service_section_unique_id = "")
      transition = Transition.new(
                    :type => transition_type,
                    :to_user_local => to_user_local,
                    :to_user_remote => to_user_remote,
                    :to_user_agency => to_user_agency,
                    :to_user_local_status => to_user_local_status,
                    :transitioned_by => user_name,
                    :notes => notes,
                    :is_remote => is_remote,
                    :type_of_export => type_of_export,
                    :service => service,
                    :service_section_unique_id => service_section_unique_id,
                    :consent_overridden => consent_overridden,
                    :consent_individual_transfer => consent_individual_transfer,
                    :created_at => DateTime.now)
      self.transitions.unshift(transition)
    end

    def transitions_transfer_status(transfer_id, transfer_status, user, rejected_reason)
      if transfer_status == Transition::TO_USER_LOCAL_STATUS_ACCEPTED ||
         transfer_status == Transition::TO_USER_LOCAL_STATUS_REJECTED
        #Retrieve the transfer that user accept/reject.
        transfer = self.transfers.select{|t| t.id == transfer_id }.first
        if transfer.present?
          #Validate that the transitions is in progress and the user is related to.
          if transfer.is_transfer_in_progress? && transfer.is_assigned_to_user_local?(user.user_name)
            #Change Status according the action executed.
            transfer.to_user_local_status = transfer_status
            #When is a reject action, there could be a reason.
            if rejected_reason.present?
              transfer.rejected_reason = rejected_reason
            end
            #Update the top level transfer status.
            self.transfer_status = transfer_status
            #Either way Accept or Reject the current user should be removed from the associated users.
            #So, it will have no access to the record anymore.
            self.assigned_user_names = self.assigned_user_names.reject{|u| u == user.user_name}
            if transfer_status == Transition::TO_USER_LOCAL_STATUS_ACCEPTED
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

  def referrals
    self.transitions.select{|t| t.type == Transition::TYPE_REFERRAL}
  end

  def set_service_as_referred( service_object_id )
    if service_object_id.present?
      service_object = self.services_section.select {|s| s.unique_id == service_object_id}.first
      service_object.service_status_referred=true if defined?(service_object.service_status_referred)
    end
  end

  def transfers
    self.transitions.select{|t| t.type == Transition::TYPE_TRANSFER}
  end

  def transition_by_type_and_id(type, id)
    self.transitions.select{|t| t.type == type && t.id == id}.first
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
    transitions = self.try(:transitions)
    if transitions.present?
      ext_referrals = transitions.select do |transition|
        transition.type == Transition::TYPE_REFERRAL && transition.is_remote
      end
      if ext_referrals.present?
        # Expected result is either one or zero element array
        referral = [ext_referrals.first]
      end
    end
    referral
  end

  def given_consent(type = Transition::TYPE_REFERRAL)
    if self.module_id == PrimeroModule::GBV
      consent_for_services == true
    elsif self.module_id == PrimeroModule::CP
      if type == Transition::TYPE_REFERRAL
        disclosure_other_orgs == true && consent_for_services == true
      else
        disclosure_other_orgs == true
      end
    end
  end

  def transitions_created_at
    return [] if transitions.blank?
    transitions.map(&:created_at).compact
  end

  def update_transition_change_at
    self.transitions_changed_at = DateTime.now if owned_attributes_changed? || services_implemented_day_time_changed?
  end

end
