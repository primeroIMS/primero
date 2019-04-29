gbv_reported_elsewhere_subform_fields = [
  Field.new({"name" => "gbv_reported_elsewhere_organization_type",
             "type" => "select_box",
             "display_name_en" => "Type of service provider where the survivor reported the incident",
             "option_strings_text_en" => [
               { id: 'health_medical_service', display_text: "Health / Medical Services" },
               { id: 'psychosocial_service', display_text: "Psychosocial / Counseling Services" },
               { id: 'police_other_service', display_text: "Police / Other Security Actor" },
               { id: 'legal_assistance_service', display_text: "Legal Assistance Services" },
               { id: 'livelihoods_service', display_text: "Livelihoods Program" },
               { id: 'safehouse_service', display_text: "Safe House / Shelter" },
               { id: 'other', display_text: "Other" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "gbv_reported_elsewhere_organization_provider",
             "type" => "text_field",
             "display_name_en" => "Name of the service provider"
            })
]

gbv_reported_elsewhere_subform = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 1,
  :unique_id => "gbv_reported_elsewhere_subform",
  :parent_form=>"incident",
  "editable" => true,
  :fields => gbv_reported_elsewhere_subform_fields,
  :initial_subforms => 0,
  "name_en" => "GBV Reported Elsewhere Subform",
  "description_en" => "GBV Reported Elsewhere Subform",
  "collapsed_field_names" => ["gbv_reported_elsewhere_organization_provider"]
})

gbv_sexual_violence_fields = [
  Field.new({"name" => "gbv_sexual_violence_type",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Type of Incident Violence",
             "option_strings_source" => "lookup lookup-gbv-sexual-violence-type",
             "guiding_questions" => "The six core types of GBV and their definitions are:

                1. Rape—non-consensual penetration (however slight) of the vagina, anus or mouth with a penis or other body part. Also includes non-consensual penetration of the vagina or anus with an object. Examples can include but are not limited to: gang rape, marital rape, sodomy, forced oral sex. This type of GBV does not include attempted rape since no penetration has occurred.

                2. Sexual Assault—any form of non-consensual sexual contact that does not result in or include penetration. Examples can include but are not limited to: attempted rape, unwanted kissing, unwanted stroking, unwanted touching of breasts, genitalia and buttocks, and female genital cutting / mutilation. This type of GBV does not include rape since rape involves penetration.

                3. Physical Assault—physical violence that is not sexual in nature. Examples can include but are not limited to: hitting, slapping, choking, cutting, shoving, burning, shooting or use of any weapons, acid attacks or any other act that results in physical pain, discomfort or injury. This type of GBV does not include female genital cutting / mutilation, or honor killing.

                4. Forced Marriage—the marriage of an individual against her or his will.

                5. Denial of Resources, Opportunities or Services—denial of rightful access to economic resources/assets or livelihood opportunities, education, health or other social services. Examples can include but are not limited to: a widow prevented from receiving an inheritance, earnings taken by an intimate partner or family member, a woman prevented from using contraceptives, a girl prevented from attending school, etc. This type of GBV does not include reports of general poverty.

                6. Psychological/Emotional Abuse—infliction of mental or emotional pain or injury. Examples can include but are not limited to: threats of physical or sexual violence, intimidation, humiliation, forced isolation, stalking, verbal harassment, unwanted attention, remarks, gestures or written words of a sexual and/or menacing nature, destruction of cherished things, etc.
             "
            }),
  Field.new({"name" => "non_gbv_type_notes",
             "mobile_visible" => false,
             "type" => "textarea",
             "display_name_en" => "If Non-GBV, describe"
            }),
  Field.new({"name" => "harmful_traditional_practice",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Was this incident a Harmful Traditional Practice",
             "option_strings_text_en" => [
               { id: 'no', display_text: "no" },
               { id: 'type_of_practice_1', display_text: "Type of Practice 1" },
               { id: 'type_of_practice_2', display_text: "Type of Practice 2" },
               { id: 'type_of_practice_3', display_text: "Type of Practice 3" },
               { id: 'type_of_practice_4', display_text: "Type of Practice 4" },
               { id: 'type_of_practice_5', display_text: "Type of Practice 5" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "goods_money_exchanged",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Were money, goods, benefits, and/or services exchanged in relation to the incident?",
             "option_strings_source" => "lookup lookup-yes-no"
            }),
  Field.new({"name" => "abduction_status_time_of_incident",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "select_box",
             "display_name_en" => "Type of abduction at time of the incident",
             "option_strings_text_en" => [
               { id: 'none', display_text: "None" },
               { id: 'forced_conscription', display_text: "Forced Conscription" },
               { id: 'trafficked', display_text: "Trafficked" },
               { id: 'other_abduction_kidnapping', display_text: "Other Abduction/Kidnapping" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "gbv_reported_elsewhere",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Has the client reported this incident anywhere else?",
             "option_strings_source" => "lookup lookup-gbv-reported-elsewhere"
            }),
  Field.new({"name" => "gbv_reported_elsewhere_subform",
             "mobile_visible" => false,
             "type" => "subform",
             "editable" => true,
             "subform_section" => gbv_reported_elsewhere_subform,
             "display_name_en" => "If yes, where?"
            }),
  Field.new({"name" => "gbv_previous_incidents",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "radio_button",
             "display_name_en" => "Has the client had any previous incidents of GBV perpetrated against them?",
             "option_strings_source" => "lookup lookup-yes-no"
            })
]

FormSection.create_or_update_form_section({
  unique_id: "gbv_sexual_violence",
  parent_form: "incident",
  visible: true,
  order_form_group: 40,
  order: 40,
  order_subform: 0,
  form_group_id: "type_of_violence",
  editable: true,
  fields: gbv_sexual_violence_fields,
  mobile_form: true,
  name_en: "Type of Violence",
  description_en: "Type of Violence"
})
