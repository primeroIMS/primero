# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

PrimeroModule.create_or_update!(
  unique_id: 'primeromodule-cp',
  name: 'CP',
  description: 'Child Protection',
  associated_record_types: %w[case tracing_request incident registry_record family],
  form_sections: FormSection.where(
    unique_id: %w[
      activities assessment basic_identity best_interest
      care_arrangements care_assessment child_under_5 bia_documents
      child_wishes closure_form consent family_details followup
      interview_details other_documents other_identity_details partner_details
      photos_and_audio protection_concern_details protection_concern
      record_owner services tracing verification bid_documents
      tracing_request_inquirer tracing_request_record_owner tracing_request_tracing_request
      tracing_request_photos_and_audio followup reunification_details other_reportable_fields_case
      other_reportable_fields_tracing_request referral_transfer notes cp_case_plan cp_bia_form
      cp_incident_form cp_individual_details cp_offender_details cp_other_reportable_fields cp_incident_record_owner
      incident_details_container approvals conference_details_container
      summary referral incident_from_case transfer_assignments change_logs registry_from_case registry_details
      family_change_logs family_closure_form family_consent family_members family_overview family_notes family_documents
      other_reportable_fields_family family_record_owner
    ]
  ),
  field_map: {
    map_to: 'primeromodule-cp',
    fields: [
      {
        source: %w[incident_details cp_incident_identification_violence],
        target: 'cp_incident_identification_violence'
      },
      {
        source: %w[incident_details incident_date],
        target: 'incident_date'
      },
      {
        source: %w[incident_details cp_incident_location_type],
        target: 'cp_incident_location_type'
      },
      {
        source: %w[incident_details cp_incident_location_type_other],
        target: 'cp_incident_location_type_other'
      },
      {
        source: %w[incident_details incident_location],
        target: 'incident_location'
      },
      {
        source: %w[incident_details cp_incident_timeofday],
        target: 'cp_incident_timeofday'
      },
      {
        source: %w[incident_details cp_incident_timeofday_actual],
        target: 'cp_incident_timeofday_actual'
      },
      {
        source: %w[incident_details cp_incident_violence_type],
        target: 'cp_incident_violence_type'
      },
      {
        source: %w[incident_details cp_incident_previous_incidents],
        target: 'cp_incident_previous_incidents'
      },
      {
        source: %w[incident_details cp_incident_previous_incidents_description],
        target: 'cp_incident_previous_incidents_description'
      },
      {
        source: %w[incident_details cp_incident_abuser_name],
        target: 'cp_incident_abuser_name'
      },
      {
        source: %w[incident_details cp_incident_perpetrator_nationality],
        target: 'cp_incident_perpetrator_nationality'
      },
      {
        source: %w[incident_details perpetrator_sex],
        target: 'perpetrator_sex'
      },
      {
        source: %w[incident_details cp_incident_perpetrator_age],
        target: 'cp_incident_perpetrator_age'
      },
      {
        source: %w[incident_details cp_incident_perpetrator_national_id_no],
        target: 'cp_incident_perpetrator_national_id_no'
      },
      {
        source: %w[incident_details cp_incident_perpetrator_other_id_type],
        target: 'cp_incident_perpetrator_other_id_type'
      },
      {
        source: %w[incident_details cp_incident_perpetrator_other_id_no],
        target: 'cp_incident_perpetrator_other_id_no'
      },
      {
        source: %w[incident_details cp_incident_perpetrator_marital_status],
        target: 'cp_incident_perpetrator_marital_status'
      },
      {
        source: %w[incident_details cp_incident_perpetrator_occupation],
        target: 'cp_incident_perpetrator_occupation'
      },
      {
        source: %w[incident_details cp_incident_perpetrator_relationship],
        target: 'cp_incident_perpetrator_relationship'
      },
      {
        source: %w[age],
        target: 'age'
      },
      {
        source: %w[sex],
        target: 'cp_sex'
      },
      {
        source: %w[nationality],
        target: 'cp_nationality'
      },
      {
        source: %w[national_id_no],
        target: 'national_id_no'
      },
      {
        source: %w[other_id_type],
        target: 'other_id_type'
      },
      {
        source: %w[other_id_no],
        target: 'other_id_no'
      },
      {
        source: %w[maritial_status],
        target: 'maritial_status'
      },
      {
        source: %w[educational_status],
        target: 'educational_status'
      },
      {
        source: %w[occupation],
        target: 'occupation'
      },
      {
        source: %w[disability_type],
        target: 'cp_disability_type'
      },
      {
        source: %w[owned_by],
        target: 'owned_by'
      }
    ]
  },
  module_options: {
    workflow_status_indicator: true,
    allow_searchable_ids: true,
    use_workflow_service_implemented: true,
    use_workflow_case_plan: true,
    use_workflow_assessment: false,
    reporting_location_filter: true
  },
  primero_program: PrimeroProgram.find_by(unique_id: 'primeroprogram-primero')
)
