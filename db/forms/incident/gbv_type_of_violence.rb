gbv_reported_elsewhere_subform_fields = [
  Field.new({"name" => "gbv_reported_elsewhere_organization_type",
             "type" => "select_box",
             "display_name_all" => "Type of service provider where the survivor reported the incident",
             "option_strings_text_all" =>
                                    ["Health / Medical Services",
                                     "Psychosocial / Counseling Services",
                                     "Police / Other Security Actor",
                                     "Legal Assistance Services",
                                     "Livelihoods Program",
                                     "Safe House / Shelter",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "gbv_reported_elsewhere_organization_provider",
             "type" => "text_field",
             "display_name_all" => "Name of the service provider"
            }),
  Field.new({"name" => "gbv_reported_elsewhere_reporting",
             "type" => "radio_button",
             "display_name_all" => "Is this a GBV reporting organization?",
             "option_strings_text_all" => "Yes\nNo"
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
  :initial_subforms => 1,
  "name_all" => "GBV Reported Elsewhere Subform",
  "description_all" => "GBV Reported Elsewhere Subform",
  "collapsed_fields" => ["gbv_reported_elsewhere_organization_provider"]
})

gbv_sexual_violence_fields = [
  Field.new({"name" => "gbv_sexual_violence_type",
             "type" => "select_box",
             "display_name_all" => "Type of Incident Violence",
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
             "type" => "textarea",
             "display_name_all" => "If Non-GBV, describe"
            }),
  Field.new({"name" => "harmful_traditional_practice",
             "type" => "select_box",
             "display_name_all" => "Was this incident a Harmful Traditional Practice",
             "option_strings_text_all" => "Option 1\nOption 2\nOption 3\nOption 4\nOption 5\nNo",
             "option_strings_text_all" =>
                                    ["No",
                                     "Type of Practice 1",
                                     "Type of Practice 2",
                                     "Type of Practice 3",
                                     "Type of Practice 4",
                                     "Type of Practice 5"].join("\n")
            }),
  Field.new({"name" => "goods_money_exchanged",
             "type" => "radio_button",
             "display_name_all" => "Were money, goods, benefits, and/or services exchanged in relation to the incident?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "abduction_status_time_of_incident",
             "type" => "select_box",
             "display_name_all" => "Type of abduction at time of the incident",
             "option_strings_text_all" =>
                                    ["None",
                                     "Forced Conscription",
                                     "Trafficked",
                                     "Other Abduction/Kidnapping"].join("\n")
            }),
  Field.new({"name" => "gbv_reported_elsewhere",
             "type" => "radio_button",
             "display_name_all" => "Has the client reported this incident anywhere else?",
             "option_strings_text_all" => "Yes\nNo"
            }),
  Field.new({"name" => "gbv_reported_elsewhere_subform",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => gbv_reported_elsewhere_subform.unique_id,
             "display_name_all" => "If yes, where?"
            }),
  Field.new({"name" => "gbv_do_not_report",
             "type" => "check_boxes",
             "display_name_all" => "Exclude this incident from reports?",
             "option_strings_text_all" => "Yes",
             "editable" => false,
             "disabled" => true
            }),
  Field.new({"name" => "gbv_previous_incidents",
             "type" => "radio_button",
             "display_name_all" => "Has the client had any previous incidents of GBV perpetrated against them?",
             "option_strings_text_all" => "Yes\nNo"
            }),
]

FormSection.create_or_update_form_section({
  :unique_id => "gbv_sexual_violence",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 40,
  :order => 40,
  :order_subform => 0,
  :form_group_name => "Type of Violence",
  "editable" => true,
  :fields => gbv_sexual_violence_fields,
  "name_all" => "Type of Violence",
  "description_all" => "Type of Violence"
})
