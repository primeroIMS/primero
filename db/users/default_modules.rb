def create_or_update_module(module_hash)
  module_id = PrimeroModule.id_from_name(module_hash[:name])
  primero_module = PrimeroModule.get(module_id)


  #Include associated subforms
  #TODO: Refactor to use FormSection.get_subforms
  if module_hash[:associated_form_ids].present?
    #Preserve existing associated form ids
    module_hash[:associated_form_ids] = module_hash[:associated_form_ids] | primero_module.associated_form_ids if primero_module.present?

    associated_forms = FormSection.by_unique_id(keys: module_hash[:associated_form_ids]).all
    if associated_forms.present?
      subform_ids = []
      associated_forms.map{|f| f.fields}.flatten.each do |field|
        if field.type == 'subform' && field.subform_section_id
          subform_ids.push field.subform_section_id
        end
      end
      module_hash[:associated_form_ids] = module_hash[:associated_form_ids] | subform_ids
    end
  end

  if primero_module.nil?
    puts "Creating module #{module_id}"
    PrimeroModule.create! module_hash
  else
    puts "Updating module #{module_id}"
    primero_module.update_attributes module_hash
  end

end


create_or_update_module(
  name: "CP",
  description: "Child Protection",
  associated_record_types: ["case", "tracing_request", "incident"],
  associated_form_ids: [
    "activities", "assessment", "basic_identity", "best_interest", "caafag_profile",
    "care_arrangements", "care_assessment", "child_under_5", "bia_documents",
    "child_wishes", "closure_form", "consent", "family_details", "followup",
    "interview_details", "other_documents", "other_identity_details", "partner_details",
    "photos_and_audio", "protection_concern_details", "protection_concern",
    "record_owner", "services", "tracing", "verification", "bid_documents",
    "tracing_request_inquirer", "tracing_request_record_owner", "tracing_request_tracing_request",
    "tracing_request_photos_and_audio", "followup", "reunification_details", "other_reportable_fields_case",
    "other_reportable_fields_tracing_request", "referral_transfer", "notes", "cp_case_plan", "cp_bia_form",
    "cp_incident_form", "cp_individual_details", "cp_offender_details", "cp_other_reportable_fields", "cp_incident_record_owner",
    "incident_details_container", "approvals", "conference_details_container"
  ],
  field_map: {
    map_to: "primeromodule-cp",
    fields: [
      {
        source: [
          "incident_details",
          "cp_incident_identification_violence"
        ],
        target: "cp_incident_identification_violence"
      },
      {
        source: [
          "incident_details",
          "cp_incident_date"
        ],
        target: "cp_incident_date"
      },
      {
        source: [
          "incident_details",
          "cp_incident_location_type"
        ],
        target: "cp_incident_location_type"
      },
      {
        source: [
          "incident_details",
          "cp_incident_location_type_other"
        ],
        target: "cp_incident_location_type_other"
      },
      {
        source: [
          "incident_details",
          "cp_incident_location"
        ],
        target: "cp_incident_location"
      },
      {
        source: [
          "incident_details",
          "cp_incident_timeofday"
        ],
        target: "cp_incident_timeofday"
      },
      {
        source: [
          "incident_details",
          "cp_incident_timeofday_actual"
        ],
        target: "cp_incident_timeofday_actual"
      },
      {
        source: [
          "incident_details",
          "cp_incident_violence_type"
        ],
        target: "cp_incident_violence_type"
      },
      {
        source: [
          "incident_details",
          "cp_incident_previous_incidents"
        ],
        target: "cp_incident_previous_incidents"
      },
      {
        source: [
          "incident_details",
          "cp_incident_previous_incidents_description"
        ],
        target: "cp_incident_previous_incidents_description"
      },
      {
        source: [
          "incident_details",
          "cp_incident_abuser_name"
        ],
        target: "cp_incident_abuser_name"
      },
      {
        source: [
          "incident_details",
          "cp_incident_perpetrator_nationality"
        ],
        target: "cp_incident_perpetrator_nationality"
      },
      {
        source: [
          "incident_details",
          "perpetrator_sex"
        ],
        target: "perpetrator_sex"
      },
      {
        source: [
          "incident_details",
          "cp_incident_perpetrator_age"
        ],
        target: "cp_incident_perpetrator_age"
      },
      {
        source: [
          "incident_details",
          "cp_incident_perpetrator_national_id_no"
        ],
        target: "cp_incident_perpetrator_national_id_no"
      },
      {
        source: [
          "incident_details",
          "cp_incident_perpetrator_other_id_type"
        ],
        target: "cp_incident_perpetrator_other_id_type"
      },
      {
        source: [
          "incident_details",
          "cp_incident_perpetrator_other_id_no"
        ],
        target: "cp_incident_perpetrator_other_id_no"
      },
      {
        source: [
          "incident_details",
          "cp_incident_perpetrator_marital_status"
        ],
        target: "cp_incident_perpetrator_marital_status"
      },
      {
        source: [
          "incident_details",
          "cp_incident_perpetrator_occupation"
        ],
        target: "cp_incident_perpetrator_occupation"
      },
      {
        source: [
          "incident_details",
          "cp_incident_perpetrator_relationship"
        ],
        target: "cp_incident_perpetrator_relationship"
      },
      {
        source: ["age"],
        target: "age"
      },
      {
        source: ["sex"],
        target: "cp_sex"
      },
      {
        source: ["nationality"],
        target: "cp_nationality"
      },
      {
        source: ["national_id_no"],
        target: "national_id_no"
      },
      {
        source: ["other_id_type"],
        target: "other_id_type"
      },
      {
        source: ["other_id_no"],
        target: "other_id_no"
      },
      {
        source: ["maritial_status"],
        target: "maritial_status"
      },
      {
        source: ["educational_status"],
        target: "educational_status"
      },
      {
        source: ["occupation"],
        target: "occupation"
      },
      {
        source: ["disability_type"],
        target: "cp_disability_type"
      },
      {
        source: ["owned_by"],
        target: "owned_by"
      }
    ]
  },
  program_id: PrimeroProgram.by_name(:key => "Primero").first.id,
  allow_searchable_ids: true,
  use_workflow_service_implemented: true,
  use_workflow_case_plan: true,
  use_workflow_assessment: false,
  reporting_location_filter: true
)


#TODO: This list needs to be updated once we harden the GBV forms
create_or_update_module(
  name: "GBV",
  description: "Gender Based Violence",
  associated_record_types: ["case", "incident", "kpi"],
  associated_form_ids: [
    "record_owner", "consent_for_services", "gbv_survivor_information", "gbv_assessment", "gbv_introduction_and_engagement", "gbv_client_satisfaction", "gbv_case_action_planning", "gbv_case_closure", "gbv_other_kpi", "gbv_follow_up", "gbv_implement_case_action_planning",
    "other_documents", "consent_for_referrals","safety_plan",
    "incident_record_owner", "incident_service_referrals", "gbv_individual_details", "gbv_incident_form",
    "gbv_sexual_violence", "action_plan_form", "survivor_assessment_form", "gbv_case_closure_form", "alleged_perpetrators_wrapper",
    "other_reportable_fields_case", "other_reportable_fields_incident", "referral_transfer", "client_feedback", "approvals",
    "cp_case_plan", "closure_form"
  ],
  program_id: PrimeroProgram.by_name(:key => "Primero").first.id,
  user_group_filter: true
)
