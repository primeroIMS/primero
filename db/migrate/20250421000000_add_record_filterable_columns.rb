# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class AddRecordFilterableColumns < ActiveRecord::Migration[6.1]
  def change
    add_column :cases, :srch_age, :integer
    add_column :cases, :srch_created_at, :datetime
    add_column :cases, :srch_registration_date, :datetime
    add_column :cases, :srch_name, :string
    add_column :cases, :srch_module_id, :string
    add_column :cases, :srch_location_current, :string
    add_column :cases, :srch_client_code, :string
    add_column :cases, :srch_date_closure, :datetime
    add_column :cases, :srch_owned_by, :string
    add_column :cases, :srch_owned_by_agency_id, :string
    add_column :cases, :srch_owned_by_location, :string
    add_column :cases, :srch_last_updated_by, :string
    add_column :cases, :srch_record_state, :boolean, default: false
    add_column :cases, :srch_consent_reporting, :boolean, default: false
    add_column :cases, :srch_status, :string
    add_column :cases, :srch_risk_level, :string
    add_column :cases, :srch_workflow, :string
    add_column :cases, :srch_not_edited_by_owner, :boolean, default: false
    add_column :cases, :srch_flagged, :boolean, default: false
    add_column :cases, :srch_approval_status_assessment, :string
    add_column :cases, :srch_approval_status_case_plan, :string
    add_column :cases, :srch_approval_status_closure, :string
    add_column :cases, :srch_approval_status_action_plan, :string
    add_column :cases, :srch_approval_status_gbv_closure, :string
    add_column :cases, :srch_reassigned_transferred_on, :datetime
    add_column :cases, :srch_referred_users_present, :boolean, default: false
    add_column :cases, :srch_has_incidents, :boolean, default: false
    add_column :cases, :srch_transfer_status, :string
    add_column :cases, :srch_gender, :string
    add_column :cases, :srch_psychsocial_assessment_score_initial, :integer
    add_column :cases, :srch_psychsocial_assessment_score_most_recent, :integer
    add_column :cases, :srch_client_summary_worries_severity_int, :integer
    add_column :cases, :srch_closure_problems_severity_int, :integer
    add_column :cases, :srch_begin_safety_plan_prompt, :boolean, default: false
    add_column :cases, :srch_disability_status_yes_no, :string
    add_column :cases, :srch_owned_by_groups, :string, array: true, default: []
    add_column :cases, :srch_associated_user_agencies, :string, array: true, default: []
    add_column :cases, :srch_associated_user_names, :string, array: true, default: []
    add_column :cases, :srch_associated_user_groups, :string, array: true, default: []
    add_column :cases, :srch_transferred_to_users, :string, array: true, default: []
    add_column :cases, :srch_transferred_to_user_groups, :string, array: true, default: []
    add_column :cases, :srch_referred_users, :string, array: true, default: []
    add_column :cases, :srch_current_alert_types, :string, array: true, default: []
    add_column :cases, :srch_case_plan_due_dates, :datetime, array: true, default: []
    add_column :cases, :srch_service_due_dates, :datetime, array: true, default: []
    add_column :cases, :srch_assessment_due_dates, :datetime, array: true, default: []
    add_column :cases, :srch_followup_due_dates, :datetime, array: true, default: []
    add_column :cases, :srch_protection_concerns, :string, array: true, default: []
    add_column :cases, :srch_protection_risks, :string, array: true, default: []
    add_column :cases, :srch_next_steps, :string, array: true, default: []

    add_column :incidents, :srch_created_at, :datetime
    add_column :incidents, :srch_incident_date, :datetime
    add_column :incidents, :srch_incident_location, :string
    add_column :incidents, :srch_module_id, :string
    add_column :incidents, :srch_owned_by, :string
    add_column :incidents, :srch_owned_by_agency_id, :string
    add_column :incidents, :srch_record_state, :boolean, default: false
    add_column :incidents, :srch_flagged, :boolean, default: false
    add_column :incidents, :srch_not_edited_by_owner, :boolean, default: false
    add_column :incidents, :srch_status, :string
    add_column :incidents, :srch_age, :integer
    add_column :incidents, :srch_owned_by_groups, :string, array: true, default: []
    add_column :incidents, :srch_transferred_to_users, :string, array: true, default: []
    add_column :incidents, :srch_transferred_to_user_groups, :string, array: true, default: []
    add_column :incidents, :srch_associated_user_agencies, :string, array: true, default: []
    add_column :incidents, :srch_associated_user_names, :string, array: true, default: []
    add_column :incidents, :srch_associated_user_groups, :string, array: true, default: []
    add_column :incidents, :srch_armed_force_group_party_names, :string, array: true, default: []
    add_column :incidents, :srch_violation_with_verification_status, :string, array: true, default: []

    add_column :tracing_requests, :srch_created_at, :datetime
    add_column :tracing_requests, :srch_inquiry_date, :datetime
    add_column :tracing_requests, :srch_status, :string
    add_column :tracing_requests, :srch_record_state, :boolean, default: false
    add_column :tracing_requests, :srch_flagged, :boolean, default: false
    add_column :tracing_requests, :srch_not_edited_by_owner, :boolean, default: false
    add_column :tracing_requests, :srch_owned_by_groups, :string, array: true, default: []
    add_column :tracing_requests, :srch_associated_user_agencies, :string, array: true, default: []
    add_column :tracing_requests, :srch_associated_user_names, :string, array: true, default: []
    add_column :tracing_requests, :srch_associated_user_groups, :string, array: true, default: []

    add_column :families, :srch_created_at, :datetime
    add_column :families, :srch_family_registration_date, :datetime
    add_column :families, :srch_status, :string
    add_column :families, :srch_record_state, :boolean, default: false
    add_column :families, :srch_flagged, :boolean, default: false
    add_column :families, :srch_not_edited_by_owner, :boolean, default: false
    add_column :families, :srch_family_location_current, :string
    add_column :families, :srch_owned_by_groups, :string, array: true, default: []
    add_column :families, :srch_associated_user_agencies, :string, array: true, default: []
    add_column :families, :srch_associated_user_names, :string, array: true, default: []
    add_column :families, :srch_associated_user_groups, :string, array: true, default: []

    add_column :registry_records, :srch_created_at, :datetime
    add_column :registry_records, :srch_registration_date, :datetime
    add_column :registry_records, :srch_status, :string
    add_column :registry_records, :srch_record_state, :boolean, default: false
    add_column :registry_records, :srch_location_current, :string
    add_column :registry_records, :srch_not_edited_by_owner, :boolean, default: false
    add_column :registry_records, :srch_owned_by_groups, :string, array: true, default: []
    add_column :registry_records, :srch_associated_user_agencies, :string, array: true, default: []
    add_column :registry_records, :srch_associated_user_names, :string, array: true, default: []
    add_column :registry_records, :srch_associated_user_groups, :string, array: true, default: []

    add_index :cases, %i[srch_created_at], name: 'cases_srch_created_at_idx'
    add_index :cases, %i[srch_registration_date], name: 'cases_srch_registration_date_idx'
    add_index :cases, %i[srch_date_closure], name: 'cases_srch_date_closure_idx'
    add_index :cases, %i[srch_record_state srch_status srch_associated_user_names],
              name: 'cases_default_associated_user_names_idx'
    add_index :cases, %i[srch_record_state srch_status srch_associated_user_groups],
              name: 'cases_default_associated_user_groups_idx'
    add_index :cases, %i[srch_record_state srch_status srch_associated_user_agencies],
              name: 'cases_default_associated_user_agencies_idx'

    add_index :incidents, %i[srch_created_at], name: 'incidents_srch_created_at_idx'
    add_index :incidents, %i[srch_incident_date], name: 'incidents_srch_incident_date_idx'
    add_index :incidents, %i[srch_record_state srch_status srch_associated_user_names],
              name: 'incidents_default_associated_user_names_idx'
    add_index :incidents, %i[srch_record_state srch_status srch_associated_user_groups],
              name: 'incidents_default_associated_user_groups_idx'
    add_index :incidents, %i[srch_record_state srch_status srch_associated_user_agencies],
              name: 'incidents_default_associated_user_agencies_idx'

    add_index :tracing_requests, %i[srch_created_at], name: 'tracing_requests_srch_created_at_idx'
    add_index :tracing_requests, %i[srch_inquiry_date], name: 'tracing_requests_srch_inquiry_date_idx'
    add_index :tracing_requests, %i[srch_record_state srch_status srch_associated_user_names],
              name: 'tracing_requests_default_associated_user_names_idx'
    add_index :tracing_requests, %i[srch_record_state srch_status srch_associated_user_groups],
              name: 'tracing_requests_default_associated_user_groups_idx'
    add_index :tracing_requests, %i[srch_record_state srch_status srch_associated_user_agencies],
              name: 'tracing_requests_default_associated_user_agencies_idx'

    add_index :families, %i[srch_created_at], name: 'families_created_at_idx'
    add_index :families, %i[srch_family_registration_date], name: 'families_family_registration_date_idx'
    add_index :families, %i[srch_record_state srch_status srch_associated_user_names],
              name: 'families_default_associated_user_names_idx'
    add_index :families, %i[srch_record_state srch_status srch_associated_user_groups],
              name: 'families_default_associated_user_groups_idx'
    add_index :families, %i[srch_record_state srch_status srch_associated_user_agencies],
              name: 'families_default_associated_user_agencies_idx'
  end
end
