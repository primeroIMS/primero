# frozen_string_literal: true

class AddLastReferralStatusColumns < ActiveRecord::Migration[8.1]
  def change
    add_column :cases, :srch_last_referral_rejected_at, :datetime
    add_column :cases, :srch_last_referral_done_at, :datetime
    add_column :cases, :srch_referred_users_pending_present, :boolean, default: false
    add_column :cases, :srch_referred_users_accepted_present, :boolean, default: false

    add_column :incidents, :srch_last_referral_rejected_at, :datetime
    add_column :incidents, :srch_last_referral_done_at, :datetime
    add_column :incidents, :srch_referred_users_pending_present, :boolean, default: false
    add_column :incidents, :srch_referred_users_accepted_present, :boolean, default: false

    add_index :cases, :srch_last_referral_rejected_at
    add_index :cases, :srch_last_referral_done_at

    add_index :incidents, :srch_last_referral_rejected_at
    add_index :incidents, :srch_last_referral_done_at

    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_names srch_referred_users_pending_present],
              name: 'shared_with_others_referrals_pending_dashboard_user_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_groups srch_referred_users_pending_present],
              name: 'shared_with_others_referrals_pending__dashboard_group_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_agencies srch_referred_users_pending_present],
              name: 'shared_with_others_referrals_pending__dashboard_agency_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_names srch_referred_users_accepted_present],
              name: 'shared_with_others_referrals_accepted_dashboard_user_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_groups srch_referred_users_accepted_present],
              name: 'shared_with_others_referrals_accepted_dashboard_group_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_agencies srch_referred_users_accepted_present],
              name: 'shared_with_others_referrals_accepted_dashboard_agency_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_names srch_last_referral_rejected_at],
              name: 'shared_with_others_referrals_rejected_dashboard_user_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_groups srch_last_referral_rejected_at],
              name: 'shared_with_others_referrals_rejected_dashboard_group_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_agencies srch_last_referral_rejected_at],
              name: 'shared_with_others_referrals_rejected_dashboard_agency_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_names srch_last_referral_done_at],
              name: 'shared_with_others_referrals_done_dashboard_user_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_groups srch_last_referral_done_at],
              name: 'shared_with_others_referrals_done_dashboard_group_idx'
    add_index :cases,
              %i[srch_record_state srch_status srch_associated_user_agencies srch_last_referral_done_at],
              name: 'shared_with_others_referrals_done_dashboard_agency_idx'
  end
end
