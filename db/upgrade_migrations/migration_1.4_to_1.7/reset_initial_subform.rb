subforms_ids = [
"service_provider_details_other_subform_section_view_only",
"service_provider_details_economic_empowerment_subform_section_view_only",
"service_provider_details_educational_subform_section_view_only",
"service_provider_details_administrative_subform_section_view_only",
"service_provider_details_legal_subform_section_view_only",
"service_provider_details_forensic_subform_section_view_only",
"service_provider_details_judicial_subform_section_view_only",
"service_provider_details_social_services_subform_section_view_only",
"service_provider_details_psycho_social_subform_section_view_only",
"service_provider_details_psychiatric_subform_section_view_only",
"service_provider_details_medical_subform_section_view_only"
 ]

subforms_save = []

subforms_ids.each do|subform_id|
  subform = form = FormSection.get_by_unique_id(subform_id)
  subform.initial_subforms = 0
  subforms_save << subform
end

FormSection.save_all!(subforms_save)