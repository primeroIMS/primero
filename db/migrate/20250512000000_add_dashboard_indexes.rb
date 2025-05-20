# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class AddDashboardIndexes < ActiveRecord::Migration[6.1]
  NEW_OR_UPDATED = {
    field_names: %i[srch_record_state srch_status srch_not_edited_by_owner],
    where: %(
      (srch_record_state IS NOT NULL AND srch_record_state = TRUE)
      AND (srch_status IS NOT NULL AND srch_status = 'open')
      AND (srch_not_edited_by_owner IS NOT NULL AND srch_not_edited_by_owner = TRUE)
    )
  }.freeze

  APPROVALS = {
    assessment: {
      field_names: %i[srch_owned_by srch_record_state srch_status srch_approval_status_assessment srch_module_id],
      where: {
        pending: "srch_approval_status_assessment IS NOT NULL AND srch_approval_status_assessment = 'pending'",
        approved: "srch_approval_status_assessment IS NOT NULL AND srch_approval_status_assessment = 'approved'",
        rejected: "srch_approval_status_assessment IS NOT NULL AND srch_approval_status_assessment = 'rejected'"
      }
    },
    case_plan: {
      field_names: %i[srch_owned_by srch_record_state srch_status srch_approval_status_case_plan srch_module_id],
      where: {
        pending: "srch_approval_status_case_plan IS NOT NULL AND srch_approval_status_case_plan = 'pending'",
        approved: "srch_approval_status_case_plan IS NOT NULL AND srch_approval_status_case_plan = 'approved'",
        rejected: "srch_approval_status_case_plan IS NOT NULL AND srch_approval_status_case_plan = 'rejected'"
      }
    },
    closure: {
      field_names: %i[srch_owned_by srch_record_state srch_status srch_approval_status_closure srch_module_id],
      where: {
        pending: "srch_approval_status_closure IS NOT NULL AND srch_approval_status_closure = 'pending'",
        approved: "srch_approval_status_closure IS NOT NULL AND srch_approval_status_closure = 'approved'",
        rejected: "srch_approval_status_closure IS NOT NULL AND srch_approval_status_closure = 'rejected'"
      }
    },
    action_plan: {
      field_names: %i[srch_owned_by srch_record_state srch_status srch_approval_status_action_plan srch_module_id],
      where: {
        pending: "srch_approval_status_action_plan IS NOT NULL AND srch_approval_status_action_plan = 'pending'",
        approved: "srch_approval_status_action_plan IS NOT NULL AND srch_approval_status_action_plan = 'approved'",
        rejected: "srch_approval_status_action_plan IS NOT NULL AND srch_approval_status_action_plan = 'rejected'"
      }
    },
    gbv_closure: {
      field_names: %i[srch_owned_by srch_record_state srch_status srch_approval_status_gbv_closure srch_module_id],
      where: {
        pending: "srch_approval_status_gbv_closure IS NOT NULL AND srch_approval_status_gbv_closure = 'pending'",
        approved: "srch_approval_status_gbv_closure IS NOT NULL AND srch_approval_status_gbv_closure = 'approved'",
        rejected: "srch_approval_status_gbv_closure IS NOT NULL AND srch_approval_status_gbv_closure = 'rejected'"
      }
    }
  }.freeze

  SHARED_WITH_OTHERS = {
    transfers: {
      field_names: %i[srch_record_state srch_status srch_transfer_status srch_owned_by],
      where: {
        pending: "srch_transfer_status IS NOT NULL AND srch_transfer_status = 'in_progress'",
        rejected: "srch_transfer_status IS NOT NULL AND srch_transfer_status = 'rejected'"
      }
    },
    referrals: {
      field_names: %i[srch_record_state srch_status srch_referred_users_present srch_owned_by],
      where: {
        users_present: 'srch_referred_users_present IS NOT NULL AND srch_referred_users_present = TRUE'
      }
    }
  }.freeze

  SHARED_WITH_ME_NEW_REFERRALS_FIELD_NAMES = %i[
    srch_record_state srch_status srch_referred_users srch_last_updated_by
  ].freeze

  SHARED_WITH_ME_TRANSFERS_AWAITING_FIELD_NAMES = %i[
    srch_record_state srch_status srch_transferred_to_users
  ].freeze

  def change
    APPROVALS.each do |(type, opts)|
      opts[:where].each_key do |status|
        add_index :cases,
                  %i[srch_associated_user_names] + opts[:field_names],
                  name: "approvals_#{type}_#{status}_dashboard_user_idx",
                  where: opts[:where][status]
        add_index :cases,
                  %i[srch_associated_user_groups] + opts[:field_names],
                  name: "approvals_#{type}_#{status}_dashboard_group_idx",
                  where: opts[:where][status]
        add_index :cases,
                  %i[srch_associated_user_agencies] + opts[:field_names],
                  name: "approvals_#{type}_#{status}_dashboard_agency_idx",
                  where: opts[:where][status]
      end
    end

    SHARED_WITH_OTHERS.each do |(type, opts)|
      opts[:where].each_key do |status|
        add_index :cases,
                  %i[srch_associated_user_names] + opts[:field_names],
                  name: "shared_with_others_#{type}_#{status}_dashboard_user_idx",
                  where: opts[:where][status]
        add_index :cases,
                  %i[srch_associated_user_groups] + opts[:field_names],
                  name: "shared_with_others_#{type}_#{status}_dashboard_group_idx",
                  where: opts[:where][status]
        add_index :cases,
                  %i[srch_associated_user_agencies] + opts[:field_names],
                  name: "shared_with_others_#{type}_#{status}_dashboard_agency_idx",
                  where: opts[:where][status]
      end
    end

    add_index :cases,
              %i[srch_associated_user_names] + NEW_OR_UPDATED[:field_names],
              name: 'new_or_updated_dashboard_user_idx',
              where: NEW_OR_UPDATED[:where]
    add_index :cases,
              %i[srch_associated_user_groups] + NEW_OR_UPDATED[:field_names],
              name: 'new_or_updated_dashboard_group_idx',
              where: NEW_OR_UPDATED[:where]
    add_index :cases,
              %i[srch_associated_user_agencies] + NEW_OR_UPDATED[:field_names],
              name: 'new_or_updated_dashboard_agency_idx',
              where: NEW_OR_UPDATED[:where]

    add_index :cases,
              %i[srch_associated_user_names] + SHARED_WITH_ME_NEW_REFERRALS_FIELD_NAMES,
              name: 'shared_with_me_new_referrals_dashboard_user_idx'
    add_index :cases,
              %i[srch_associated_user_groups] + SHARED_WITH_ME_NEW_REFERRALS_FIELD_NAMES,
              name: 'shared_with_me_new_referrals_dashboard_group_idx'
    add_index :cases,
              %i[srch_associated_user_agencies] + SHARED_WITH_ME_NEW_REFERRALS_FIELD_NAMES,
              name: 'shared_with_me_new_referrals_dashboard_agency_idx'

    add_index :cases,
              %i[srch_associated_user_names] + SHARED_WITH_ME_TRANSFERS_AWAITING_FIELD_NAMES,
              name: 'shared_with_me_transfers_awaiting_dashboard_user_idx'
    add_index :cases,
              %i[srch_associated_user_groups] + SHARED_WITH_ME_TRANSFERS_AWAITING_FIELD_NAMES,
              name: 'shared_with_me_transfers_awaiting_dashboard_group_idx'
    add_index :cases,
              %i[srch_associated_user_agencies] + SHARED_WITH_ME_TRANSFERS_AWAITING_FIELD_NAMES,
              name: 'shared_with_me_transfers_awaiting_dashboard_agency_idx'

    # TODO: In Rails 7 this can be rewritten with AR.
    execute %(
      CREATE INDEX workflow_dashboard_user_idx
      ON cases (srch_associated_user_names, srch_owned_by, srch_record_state, srch_status, srch_module_id)
      INCLUDE (srch_workflow);

      CREATE INDEX workflow_dashboard_agency_idx
      ON cases (srch_associated_user_agencies, srch_owned_by, srch_record_state, srch_status, srch_module_id)
      INCLUDE (srch_workflow);

      CREATE INDEX workflow_dashboard_group_idx
      ON cases (srch_associated_user_groups, srch_owned_by, srch_record_state, srch_status, srch_module_id)
      INCLUDE (srch_workflow);

      CREATE INDEX risk_level_dashboard_user_idx
      ON cases (srch_associated_user_names, srch_record_state, srch_status)
      INCLUDE (srch_risk_level);

      CREATE INDEX risk_level_dashboard_group_idx
      ON cases (srch_associated_user_groups, srch_record_state, srch_status)
      INCLUDE (srch_risk_level);

      CREATE INDEX risk_level_dashboard_agency_idx
      ON cases (srch_associated_user_agencies, srch_record_state, srch_status)
      INCLUDE (srch_risk_level);
    )
  end
end
