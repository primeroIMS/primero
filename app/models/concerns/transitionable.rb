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
  end

  def assigns
    transitions.where(type: Assign.name)
  end

  def referrals
    transitions.where(type: Referral.name)
  end

  def referrals_for_user(user)
    if owned_by != user.user_name
      referrals.where(transitioned_to: user.user_name)
    else
      referrals
    end
  end

  def transfers
    transitions.where(type: Transfer.name)
  end

  def transfer_requests
    transitions.where(type: TransferRequest.name)
  end

  def transitions_for_user(user, types=[])
    unless types.present?
      types = [Assign.name, Transfer.name, Referral.name, TransferRequest.name]
    end
    if (owned_by != user.user_name) && types.include?(Referral.name)
      types.delete(Referral.name)
      transitions.where(type: types).or(
        transitions.where(
          type: Referral.name,
          transitioned_to: user.user_name
        )
      )
    else
      transitions.where(type: types)
    end
  end

  def transferred_to_users
    transfers
      .where(status: Transition::STATUS_INPROGRESS)
      .pluck(:transitioned_to).uniq
  end

  def referred_users
    referrals
      .where(status: Transition::STATUS_INPROGRESS)
      .pluck(:transitioned_to).uniq
  end

end
