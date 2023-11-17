# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
      string :transferred_to_user_groups, multiple: true
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

  # rubocop:disable Metrics/MethodLength
  def referrals_for_user(user)
    case user.role.group_permission
    when Permission::SELF
      referrals_self_scope(user)
    when Permission::AGENCY
      referrals_agency_scope(user)
    when Permission::GROUP
      referrals_group_scope(user)
    when Permission::ALL
      referrals
    else
      none
    end
  end
  # rubocop:enable Metrics/MethodLength

  def transfers
    transitions.where(type: Transfer.name)
  end

  def transfer_requests
    transitions.where(type: TransferRequest.name)
  end

  def transitions_for_user(user, types = [])
    types = [Assign.name, Transfer.name, Referral.name, TransferRequest.name] unless types.present?
    referrals = types.include?(Referral.name) ? referrals_for_user(user) : transitions.none

    transitions.where(type: types.reject { |type| type == Referral.name }).or(referrals)
  end

  def transferred_to_users
    transfers
      .where(status: [Transition::STATUS_INPROGRESS])
      .pluck(:transitioned_to).uniq
  end

  def transferred_to_user_groups
    UserGroup.joins(:users).where(users: { name: transferred_to_users }).pluck(:unique_id)
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
    return referrals if owner?(user)

    referrals.where(transitioned_to: user.user_name)
  end

  def referrals_group_scope(user)
    return referrals if owner?(user) || (owned_by_groups & user.user_group_unique_ids).present?

    referrals.where(transitioned_to: User.by_user_group(user.user_groups.ids).pluck(:user_name))
  end

  def referrals_agency_scope(user)
    return referrals if owner?(user) || user.agency_id == owner.agency_id

    referrals.where(transitioned_to_agency: user.agency.unique_id)
  end

  def referrals_to_user(user)
    referrals.where(
      transitioned_to: user.user_name, status: [Transition::STATUS_INPROGRESS, Transition::STATUS_ACCEPTED]
    )
  end

  def referred_to_user?(user)
    !owner?(user) && referrals_to_user(user).exists?
  end

  def authorized_referral_roles(user)
    Role.where(unique_id: referrals_to_user(user).pluck(:authorized_role_unique_id))
  end

  def authorized_forms(user)
    authorized_referral_roles(user).each_with_object({}) do |role, memo|
      role.form_section_permission.each do |key, value|
        next unless value.present?

        memo[key] = value if memo[key].blank? || memo[key] == 'r'
      end
    end
  end
end
