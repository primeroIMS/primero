#TODO - The Service Referral options in each subform are all the same.  They need to be moved to a lookup
health_medical_referral_subform_fields = [
  Field.new({"name" => "service_medical_referral",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Did you refer the client to Health/Medical Services?",
             "option_strings_source" => "lookup lookup-service-referred",
            }),
  Field.new({"name" => "service_medical_appointment_date",
             "mobile_visible" => false,
             "type" => "date_field",
             "display_name_en" => "Appointment Date"
            }),
  Field.new({"name" => "service_medical_appointment_time",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Appointment Time"
            }),
  Field.new({"name" => "service_medical_provider",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Provider"
            }),
  Field.new({"name" => "service_medical_location",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Location"
            }),
  Field.new({"name" => "service_medical_referral_notes",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Notes"
            })
]

health_medical_referral_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 100,
  :order => 10,
  :order_subform => 1,
  :unique_id => "health_medical_referral_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => health_medical_referral_subform_fields,
  mobile_form: true,
  :initial_subforms => 1,
  "name_en" => "Nested Health/Medical Referral Subform",
  "description_en" => "Nested Health/Medical Referral Subform"
})

psychosocial_counseling_services_subform_fields = [
  Field.new({"name" => "service_psycho_referral",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Did you refer the client to Psychosocial/Counseling services?",
             "option_strings_source" => "lookup lookup-service-referred",
            }),
  Field.new({"name" => "service_psycho_appointment_date",
             "mobile_visible" => false,
             "type" => "date_field",
             "display_name_en" => "Appointment Date"
            }),
  Field.new({"name" => "service_psycho_appointment_time",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Appointment Time"
            }),
  Field.new({"name" => "service_psycho_provider",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Provider"
            }),
  Field.new({"name" => "service_psycho_service_location",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Location"
            }),
  Field.new({"name" => "service_psycho_referral_notes",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Notes"
            })
]

psychosocial_counseling_services_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 100,
  :order => 10,
  :order_subform => 2,
  :unique_id => "psychosocial_counseling_services_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => psychosocial_counseling_services_subform_fields,
  mobile_form: true,
  :initial_subforms => 1,
  "name_en" => "Nested Psychosocial/Counseling Services Subform",
  "description_en" => "Nested Psychosocial/Counseling Services Subform"
})

legal_assistance_services_subform_fields = [
  Field.new({"name" => "service_legal_referral",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Did you refer the client to Legal services?",
             "option_strings_source" => "lookup lookup-service-referred",
            }),
  Field.new({"name" => "service_legal_appointment_date",
             "mobile_visible" => false,
             "type" => "date_field",
             "display_name_en" => "Appointment Date"
            }),
  Field.new({"name" => "service_legal_appointment_time",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Appointment Time"
            }),
  Field.new({"name" => "service_legal_provider",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Provider"
            }),
  Field.new({"name" => "service_legal_location",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Location"
            }),
  Field.new({"name" => "service_legal_referral_notes",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Notes"
            }),
  Field.new({"name" => "pursue_legal_action",
             "mobile_visible" => false,
             "type" => "radio_button",
             "display_name_en" => "Does the client want to pursue legal action?",
             "option_strings_source" => "lookup lookup-yes-no-undecided"
            })
]

legal_assistance_services_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 100,
  :order => 10,
  :order_subform => 3,
  :unique_id => "legal_assistance_services_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => legal_assistance_services_subform_fields,
  mobile_form: true,
  :initial_subforms => 1,
  "name_en" => "Nested Legal Assistance Services Subform",
  "description_en" => "Nested Legal Assistance Services Subform"
})

police_or_other_type_of_security_services_subform_fields = [
  Field.new({"name" => "service_police_referral",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Did you refer the client to Police/Other services?",
             "option_strings_source" => "lookup lookup-service-referred",
            }),
  Field.new({"name" => "service_police_appointment_date",
             "mobile_visible" => false,
             "type" => "date_field",
             "display_name_en" => "Appointment Date"
            }),
  Field.new({"name" => "service_police_appointment_time",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Appointment Time"
            }),
  Field.new({"name" => "service_police_provider",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Provider"
            }),
  Field.new({"name" => "service_police_location",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Location"
            }),
  Field.new({"name" => "service_police_referral_notes",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Notes"
            })
]

police_or_other_type_of_security_services_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 100,
  :order => 10,
  :order_subform => 4,
  :unique_id => "police_or_other_type_of_security_services_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  mobile_form: true,
  :fields => police_or_other_type_of_security_services_subform_fields,
  :initial_subforms => 1,
  "name_en" => "Nested Police or Other Type of Security Services Subform",
  "description_en" => "Nested Police or Other Type of Security Services Subform"
})

livelihoods_services_subform_fields = [
  Field.new({"name" => "service_livelihoods_referral",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Did you refer the client to a livelihoods program?",
             "option_strings_source" => "lookup lookup-service-referred",
            }),
  Field.new({"name" => "service_livelihoods_appointment_date",
             "mobile_visible" => false,
             "type" => "date_field",
             "display_name_en" => "Appointment Date"
            }),
  Field.new({"name" => "service_livelihoods_appointment_time",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Appointment Time"
            }),
  Field.new({"name" => "service_livelihoods_provider",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Provider"
            }),
  Field.new({"name" => "service_livelihoods_location",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Location"
            }),
  Field.new({"name" => "service_livelihoods_referral_notes",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Notes"
            })
]

livelihoods_services_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 100,
  :order => 10,
  :order_subform => 5,
  :unique_id => "livelihoods_services_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => livelihoods_services_subform_fields,
  mobile_form: true,
  :initial_subforms => 1,
  "name_en" => "Nested Livelihoods Services Subform",
  "description_en" => "Nested Livelihoods Services Subform"
})

child_protection_services_subform_fields = [
  Field.new({"name" => "service_protection_referral",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Did you refer the client to Child Protection services?",
             "option_strings_source" => "lookup lookup-service-referred",
            }),
  Field.new({"name" => "service_protection_appointment_date",
             "mobile_visible" => false,
             "type" => "date_field",
             "display_name_en" => "Appointment Date"
            }),
  Field.new({"name" => "service_protection_appointment_time",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Appointment Time"
            }),
  Field.new({"name" => "service_protection_provider",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Provider"
            }),
  Field.new({"name" => "service_protection_location",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Location"
            }),
  Field.new({"name" => "service_protection_referral_notes",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Notes"
            })
]

child_protection_services_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 100,
  :order => 10,
  :order_subform => 6,
  :unique_id => "child_protection_services_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => child_protection_services_subform_fields,
  mobile_form: true,
  :initial_subforms => 1,
  "name_en" => "Nested Child Protection Services Subform",
  "description_en" => "Nested Child Protection Services Subform"
})

services_fields = [
  Field.new({"name" => "service_referred_from",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Who referred the client to you?",
             "option_strings_text_en" => [
               { id: 'health_medical_services', display_text: "Health / Medical Services" },
               { id: 'psychosocial_counseling_services', display_text: "Psychosocial / Counseling Services" },
               { id: 'police_other_security_actor', display_text: "Police / Other Security Actor" },
               { id: 'legal_assistance_services', display_text: "Legal Assistance Services" },
               { id: 'livelihoods_program', display_text: "Livelihoods Program" },
               { id: 'self_referral_first_point_of_contact', display_text: "Self Referral / First Point of Contact" },
               { id: 'teacher_school_official', display_text: "Teacher / School Official" },
               { id: 'community_or_camp_leader', display_text: "Community or Camp Leader" },
               { id: 'safe_house_shelter', display_text: "Safe House / Shelter" },
               { id: 'other_humanitarian_or_development_actor', display_text: "Other Humanitarian or Development Actor" },
               { id: 'other_government_service', display_text: "Other Government Service" },
               { id: 'other', display_text: "Other" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "service_referred_from_other",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "If survivor referred from Other, please specify."
            }),
  Field.new({"name" => "safe_house_safe_shelter_referral",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "separator",
             "display_name_en" => "Safe House/Safe Shelter Referral"
            }),
  Field.new({"name" => "service_safehouse_referral",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Did you refer the client to a safe house/safe shelter?",
             "option_strings_source" => "lookup lookup-service-referred",
            }),
  Field.new({"name" => "service_safehouse_appointment_date",
             "mobile_visible" => false,
             "type" => "date_field",
             "display_name_en" => "Appointment Date"
            }),
  Field.new({"name" => "service_safehouse_appointment_time",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Appointment Time"
            }),
  Field.new({"name" => "service_safehouse_provider",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Provider"
            }),
  Field.new({"name" => "service_safehouse_location",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Service Location"
            }),
  Field.new({"name" => "service_safehouse_referral_notes",
             "mobile_visible" => false,
             "type" => "text_field",
             "display_name_en" => "Notes"
            }),
  Field.new({"name" => "health_medical_referral_subform_section",
             "mobile_visible" => true,
             "show_on_minify_form" => true,
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => health_medical_referral_subform_section.unique_id,
             "display_name_en" => "Health/Medical Referral"
            }),
  Field.new({"name" => "psychosocial_counseling_services_subform_section",
             "mobile_visible" => true,
             "show_on_minify_form" => true,
             "type" => "subform", "editable" => true,
             "subform_section_id" => psychosocial_counseling_services_subform_section.unique_id,
             "display_name_en" => "Psychosocial/Counseling Services"
            }),
  Field.new({"name" => "legal_assistance_services_subform_section",
             "mobile_visible" => true,
             "show_on_minify_form" => true,
             "type" => "subform", "editable" => true,
             "subform_section_id" => legal_assistance_services_subform_section.unique_id,
             "display_name_en" => "Legal Assistance Services"
            }),
  Field.new({"name" => "police_or_other_type_of_security_services_subform_section",
             "mobile_visible" => true,
             "show_on_minify_form" => true,
             "type" => "subform", "editable" => true,
             "subform_section_id" => police_or_other_type_of_security_services_subform_section.unique_id,
             "display_name_en" => "Police or Other Type of Security Services"
           }),
  Field.new({"name" => "livelihoods_services_subform_section",
             "mobile_visible" => true,
             "show_on_minify_form" => true,
             "type" => "subform", "editable" => true,
             "subform_section_id" => livelihoods_services_subform_section.unique_id,
             "display_name_en" => "Livelihoods Services"
            }),
  Field.new({"name" => "child_protection_services_subform_section",
             "mobile_visible" => true,
             "show_on_minify_form" => true,
             "type" => "subform", "editable" => true,
             "subform_section_id" => child_protection_services_subform_section.unique_id,
             "display_name_en" => "Child Protection Services"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "incident_service_referrals",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 100,
  :order => 10,
  :order_subform => 0,
  :form_group_id => "service_referral",
  "editable" => true,
  :fields => services_fields,
  :mobile_form => true,
  "name_en" => "Service Referrals",
  "description_en" => "Service Referrals"
})