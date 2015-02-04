module Transitionable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  included do
    property :transitions, [Transition], :default => []


    def add_transition(transition_type, to_user_local, to_user_remote, to_user_agency, notes,
                       is_remote, is_remote_primero, user_name, service = "")
      transition = Transition.new(
                    :type => transition_type,
                    :to_user_local => to_user_local,
                    :to_user_remote => to_user_remote,
                    :to_user_agency => to_user_agency,
                    :transitioned_by => user_name,
                    :notes => notes,
                    :is_remote => is_remote,
                    :is_remote_primero => is_remote_primero,
                    :service => service,
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

  def given_consent(type = Transition::TYPE_REFERRAL)
    if type == Transition::TYPE_REFERRAL
      #TODO - consent_for_services should be a bool (ie use tick_box), not yes/no
      #     - this is very brittle.  It does not hold up to i18n
      disclosure_other_orgs == true && (consent_for_services.present? && consent_for_services == true)
    else
      disclosure_other_orgs == true
    end
  end

end
