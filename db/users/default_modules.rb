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
  associated_record_types: ["case", "tracing_request"],
  associated_form_ids: [
    "activities", "basic_identity", "best_interest", "caafag_profile",
    "care_arrangements", "care_assessment", "child_under_5", "bia_documents",
    "child_wishes", "closure_form", "consent", "family_details", "followup",
    "interview_details", "other_documents", "other_identity_details", "partner_details",
    "photos_and_audio", "protection_concern_details", "protection_concern",
    "record_owner", "services", "tracing", "verification", "bid_documents",
    "tracing_request_inquirer", "tracing_request_record_owner", "tracing_request_tracing_request",
    "tracing_request_photos_and_audio", "followup", "reunification_details", "other_reportable_fields_case",
    "other_reportable_fields_tracing_request", "referral_transfer", "notes", "cp_case_plan", "cp_bia_form",
    "approvals"
  ],
  program_id: PrimeroProgram.by_name(:key => "Primero").first.id,
  allow_searchable_ids: true
)


#TODO: This list needs to be updated once we harden the GBV forms
create_or_update_module(
  name: "GBV",
  description: "Gender Based Violence",
  associated_record_types: ["case", "incident"],
  associated_form_ids: [
    "record_owner", "consent_for_services", "gbv_survivor_information",
    "other_documents", "consent_for_referrals","safety_plan",
    "incident_record_owner", "incident_service_referrals", "gbv_individual_details", "gbv_incident_form",
    "gbv_sexual_violence", "action_plan_form", "survivor_assessment_form", "gbv_case_closure_form", "alleged_perpetrators_wrapper",
    "other_reportable_fields_case", "other_reportable_fields_incident", "referral_transfer"
  ],
  program_id: PrimeroProgram.by_name(:key => "Primero").first.id
)