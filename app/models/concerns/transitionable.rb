module Transitionable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  included do
    property :transitions, [Transition], :default => []


    def add_transition(transition_type, to_user_local, to_user_remote, to_user_agency, to_user_local_status, notes,
                       is_remote, type_of_export, user_name, consent_overridden, service = "")
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
                    :consent_overridden => consent_overridden,
                    :created_at => DateTime.now)
      self.transitions.unshift(transition)
      transition
    end
  end

  def referrals
    self.transitions.select{|t| t.type == 'referral'}
  end

  def transfers
    self.transitions.select{|t| t.type == 'transfer'}
  end

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

end
