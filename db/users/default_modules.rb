def create_or_update_module(module_hash)
  module_id = PrimeroModule.id_from_name(module_hash[:name])
  primero_module = PrimeroModule.get(module_id)


  #Include associated subforms
  if module_hash[:associated_form_ids].present?
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
  associated_form_ids: [
    "activities", "basic_identity", "best_interest", "caafag_profile",
    "care_arrangements", "care_assessment", "child_under_5",
    "child_wishes", "closure_form", "consent", "family_details", "followup",
    "interview_details", "other_documents", "other_identity_details", "partner_details",
    "photos_and_audio", "protection_concern_details", "protection_concern",
    "record_owner", "services", "tracing", "verification"
  ],
  program_id: PrimeroProgram.by_name(:key => "Primero").first.id
)

#TODO: Add associated form ids
create_or_update_module(
  name: "GBV",
  description: "Gender Based Violence",
  associated_form_ids: ["TODO"],
  program_id: PrimeroProgram.by_name(:key => "Primero").first.id
)


#TODO: Add associated form ids
create_or_update_module(
  name: "MRM",
  description: "Monitoring and Reporting Mechanism",
  associated_form_ids: ["TODO"],
  program_id: PrimeroProgram.by_name(:key => "Primero").first.id
)