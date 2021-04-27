# frozen_string_literal: true

# Supporting logic and fields for transitions
module Transitionable
  extend ActiveSupport::Concern

  included do
    has_many :transitions, as: :record

    store_accessor :data, :transfer_status, :reassigned_transferred_on

    searchable do
      string :transfer_status, as: 'transfer_status_sci'
      string :referred_users, multiple: true
      string :transferred_to_users, multiple: true
      time :reassigned_transferred_on
      boolean :referred_users_present
    end
  end

  def assigns
    transitions.where(type: Assign.name)
  end

  def referrals
    transitions.where(type: Referral.name)
  end

  def referrals_for_user(user)
    case user.role.group_permission
    when Permission::SELF
      referrals_self_scope(user)
    when Permission::AGENCY, Permission::GROUP
      referrals_agency_group_scope(user)
    when Permission::ALL
      referrals
    else
      none
    end
  end

  def transfers
    transitions.where(type: Transfer.name)
  end

  def transfer_requests
    transitions.where(type: TransferRequest.name)
  end

  def transitions_for_user(user, types = [])
    types = [Assign.name, Transfer.name, Referral.name, TransferRequest.name] unless types.present?
    referrals = types.include?(Referral.name) ? referrals_for_user(user) : []

    transitions.where(type: types.reject { |type| type == Referral.name }) + referrals
  end

  def transferred_to_users
    transfers
      .where(status: [Transition::STATUS_INPROGRESS])
      .pluck(:transitioned_to).uniq
  end

  def referred_users
    referrals
      .where(status: [Transition::STATUS_INPROGRESS, Transition::STATUS_ACCEPTED])
      .pluck(:transitioned_to).uniq
  end

  def referred_users_present
    referred_users.present?
  end

  def referrals_self_scope(user)
    return referrals if owned_by == user.user_name

    referrals.where(transitioned_to: user.user_name)
  end

  def referrals_agency_group_scope(user)
    return referrals if (owner.user_group_unique_ids & user.user_group_unique_ids).present?

    referrals.where(transitioned_to: User.by_user_group(user.user_groups.ids).pluck(:user_name))
  end
end
