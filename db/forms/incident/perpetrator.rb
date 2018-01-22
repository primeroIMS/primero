perpetrator_subform_fields = [
  Field.new({"name" => "perpetrator_violations",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Violation(s) for which the perpetrator is allegedly responsible",
             "option_strings_source" => "violations",
             "guiding_questions" => "The MRM remains distinct from criminal investigations and the legal responsibility "\
                                    "of an alleged perpetrator can only be established by a court of law. However, it is "\
                                    "helpful to do all feasible efforts - with due consideration for the protection and "\
                                    "confidentiality of victims, witnesses, sources and MRM monitors - to attribute incidents "\
                                    "of grave violations against children to a specific perpetrator."
            }),
  Field.new({"name" => "perpetrator_category",
             "type" => "select_box",
             "display_name_all" => "Type of perpetrator",
             "option_strings_text_all" => ["Armed force", "Armed group", "Other party to the conflict", "Unknown"].join("\n"),
             "guiding_questions" => "Armed force: Includes police, intelligence and other Governmental security forces, "\
                                    "provided that they can be characterized as parties to the conflict. Also includes "\
                                    "pro-Government militias that operate under the Government's command and control.  "\
                                    "Armed group: Includes pro-Government militias that are not formally under the "\
                                    "Government's command and control.  Other party to the conflict: Includes international "\
                                    "forces, whether United Nations (UN) or non-UN-mandated.  Unknown: Even when the "\
                                    "perpetrator is unknown, the CTFMR needs to be satisified that the violation was "\
                                    "perpetrated by a party to the conflict, and thus conflict-related",
              "help_text_all" => "This field is mandatory"
            }),
  #TODO: perpetrator_sub_category is supposed to be removed.
  # Hiding for now.
  # I commented out related filtering logic
  Field.new({"name" => "perpetrator_sub_category",
             "type" => "select_box",
             "display_name_all" => "To which type of armed force or group did the alleged perpetrator(s) belong?",
             "option_strings_source" => "lookup ArmedForceGroupType",
             "visible" => false
            }),
  Field.new({"name" => "armed_force_name",
             "type" => "select_box",
             "display_name_all" => "If armed force, please select as appropriate",
             "option_strings_source" => "lookup ArmedForceName",
             "guiding_questions" => "CTFMRs should ensure that the lists of perpetrators in the MRM IMS are as "\
                                    "comprehensive and up-to-date as possible. In case new parties need to be added to "\
                                    "the list, or should an armed force change its name, please contact the MRM Technical "\
                                    "Reference Group."
            }),
  Field.new({"name" => "armed_group_name",
             "type" => "select_box",
             "display_name_all" => "If armed group, please select as appropriate",
             "option_strings_source" => "lookup ArmedGroupName",
             "guiding_questions" => "CTFMRs should ensure that the lists of perpetrators in the MRM IMS are as "\
                                    "comprehensive and up-to-date as possible. In case new parties need to be added to "\
                                    "the list, or should an armed group change its name or fragment into multiple groups, "\
                                    "please contact the MRM Technical Reference Group."
            }),
  Field.new({"name" => "other_party_name",
             "type" => "select_box",
             "display_name_all" => "If other party to the conflict, please select as appropriate",
             "option_strings_source" => "lookup OtherPartyName",
             "guiding_questions" => "CTFMRs should ensure that the lists of perpetrators in the MRM IMS are as "\
                                    "comprehensive and up-to-date as possible. In case new parties need to be added to "\
                                    "the list, please contact the MRM Technical Reference Group."
            }),
  Field.new({"name" => "perpetrator_number",
             "type" => "numeric_field",
             "display_name_all" => "Number of individual perpetrators within the group perpetrator (if known)"
            }),
  Field.new({"name" => "perpetrator_number_estimate",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated?",
            }),
  Field.new({"name" => "perpetrator_children",
             "type" => "select_box",
             "display_name_all" => "Did the group of perpetrators include children?",
             "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n"),
             "help_text_all" => "If yes, this should be reflected in the 'Recruitment and use' form."
            }),
  Field.new({"name" => "perpetrator_children_number",
             "type" => "numeric_field",
             "display_name_all" => "If so, how many? (if known)"
            }),
  Field.new({"name" => "perpetrator_children_number_estimate",
             "type" => "tick_box",
             "tick_box_label_all" => "Yes",
             "display_name_all" => "Is this number estimated? ",
            }),
  Field.new({"name" => "perpetrator_sex",
             "type" => "select_box",
             "display_name_all" => "Sex of the perpetrator",
             "option_strings_text_all" => ["Male", "Female", "Mixed", "Unknown"].join("\n")
            }),
  Field.new({"name" => "perpetrator_nationality",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Nationality of the perpetrator",
             "option_strings_source" => "lookup Nationality"
            }),
  Field.new({"name" => "perpetrator_ethnicity",
             "type" => "select_box",
             "multi_select" => true,
             "display_name_all" => "Ethnicity of the perpetrator",
             "option_strings_source" => "lookup Ethnicity"
            }),
  Field.new({"name" => "name_perpetrator",
              "type" => "textarea",
              "display_name_all" => "Name/nickname of the perpetrator(s)",
            }),
  Field.new({"name" => "rank_perpetrator",
            "type" => "text_field",
            "display_name_all" => "Rank of the perpetrator",
            }),
  Field.new({"name" => "perpetrator_arrest",
            "type" => "select_box",
            "display_name_all" => "Was the perpetrator arrested?",
            "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
          }),
  Field.new({"name" => "arrest_details",
            "type" => "textarea",
            "display_name_all" => "Please provide additional details",
          }),
  Field.new({"name" => "perpetrator_detention",
            "type" => "select_box",
            "display_name_all" => "Was the perpetrator detained?",
            "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
          }),
  Field.new({"name" => "details_detention",
            "type" => "textarea",
            "display_name_all" => "Please provide additional details",
          }),
  Field.new({"name" => "perpetrator_conviction",
            "type" => "select_box",
            "display_name_all" => "Was the perpetrator convicted?",
            "option_strings_text_all" => ["Yes", "No", "Unknown"].join("\n")
          }),
  Field.new({"name" => "details_conviction",
            "type" => "textarea",
            "display_name_all" => "Please provide additional details",
          }),
  Field.new({"name" => "perpetrator_additional_details",
             "type" => "textarea",
             "display_name_all" => "Additional details",
             "help_text_all" => "E.g. chain of command; information on specific unit/role of the perpetrator; type of "\
                                "uniform worn; consistency between the way in which the violations were committed and "\
                                "the modus operandi of the group; specific details on individual perpetrator(s), if "\
                                "known e.g. name, sex, age, nationality, ethnicity, language(s) spoken, rank; apparent "\
                                "role of command"
            }),
  Field.new({"name" => "perpetrator_verified",
             "type" => "radio_button",
             "display_name_all" => "Is this perpetrator verified for MRM purposes?",
             "option_strings_text_all" => ["Yes", "No"].join("\n"),
             "guiding_questions" => "The MRM remains distinct from criminal investigations and the legal responsibility "\
                                    "of an alleged perpetrator can only be established by a court of law. However, it is "\
                                    "helpful to do all feasible efforts - with due consideration for the protection and "\
                                    "confidentiality of victims, witnesses, sources and MRM monitors - to attribute "\
                                    "incidents of grave violations against children to a specific perpetrator. When all "\
                                    "other elements of an incident are verified  except for the attribution to a perpetrator - "\
                                    "which may prove difficult for a variety of reasons -  the said incident may be considered "\
                                    "verified even if the perpetrator is alleged."
            })
]

#TODO: perpetrator_sub_category is supposed to be removed removed.
# BUT... there is code tied to that field as well as it being a collapsed field.
# Leaving the field for now.  Open question for Sue & Pavel
perpetrator_subform_section = FormSection.create_or_update_form_section({
  "visible" => false,
  "is_nested" => true,
  :order_form_group => 80,
  :order => 10,
  :order_subform => 1,
  :unique_id => "perpetrator_subform_section",
  :parent_form=>"incident",
  "editable" => true,
  :fields => perpetrator_subform_fields,
  :initial_subforms => 1,
  "name_all" => "Nested Perpetrator Subform",
  "description_all" => "Nested Perpetrator Subform",
  "collapsed_fields" => ["perpetrator_sub_category"]
})

perpetrator_fields = [
  Field.new({"name" => "perpetrator_subform_section",
             "type" => "subform", "editable" => true,
             "subform_section_id" => perpetrator_subform_section.unique_id,
             "display_name_all" => "Perpetrator"
            })
]

FormSection.create_or_update_form_section({
  :unique_id => "perpetrators_form",
  :parent_form=>"incident",
  "visible" => true,
  :order_form_group => 80,
  :order => 10,
  :order_subform => 0,
  :form_group_name => "Perpetrator(s)",
  "editable" => true,
  :fields => perpetrator_fields,
  "name_all" => "Perpetrator(s)",
  "description_all" => "Perpetrator(s)"
})
