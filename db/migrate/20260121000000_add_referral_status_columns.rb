# frozen_string_literal: true

class AddReferralStatusColumns < ActiveRecord::Migration[8.1]
  def change
    add_column :cases, :srch_referred_users_pending, :string, array: true, default: []
    add_column :cases, :srch_referred_users_accepted, :string, array: true, default: []

    add_column :incidents, :srch_referred_users_pending, :string, array: true, default: []
    add_column :incidents, :srch_referred_users_accepted, :string, array: true, default: []

    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_names srch_referred_users_pending],
              name: 'shared_with_me_pending_referrals_dashboard_user_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_names srch_referred_users_accepted],
              name: 'shared_with_me_accepted_referrals_dashboard_user_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_groups srch_referred_users_pending],
              name: 'shared_with_me_pending_referrals_dashboard_group_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_groups srch_referred_users_accepted],
              name: 'shared_with_me_accepted_referrals_dashboard_group_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_agencies srch_referred_users_pending],
              name: 'shared_with_me_pending_referrals_dashboard_agency_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_agencies srch_referred_users_accepted],
              name: 'shared_with_me_accepted_referrals_dashboard_agency_idx'
  end
end
