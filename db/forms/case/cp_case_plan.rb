case_plan_fields_subform = [
  Field.new({"name" => "intervention_service_to_be_provided",
             "type" => "text_field",
             "display_name_en" => "Name of intervention / service to be provided"
           }),
  Field.new({"name" => "case_plan_provider_and_contact_details",
             "type" => "textarea",
             "display_name_en" => "Person / agency providing the service or implementing the intervention / services and contact details"
            }),
  Field.new({"name" => "intervention_service_goal",
             "type" => "textarea",
             "display_name_en" => "Goal of intervention / service"
            }),
  Field.new({"name" => "case_plan_timeframe",
             "type" => "date_field",
             "display_name_en" => "Expected timeframe (end date)"
            }),
  Field.new({"name" => "case_plan_monitoring_schedule",
             "type" => "select_box",
             "display_name_en" => "Follow up / monitoring schedule",
             "option_strings_text_en" => [
               { id: 'one_time', display_text: "One time" },
               { id: 'daily', display_text: "Daily" },
               { id: 'weekly', display_text: "Weekly" },
               { id: 'monthly', display_text: "Monthly" },
               { id: 'other', display_text: "Other" }
             ].map(&:with_indifferent_access)
            }),
  Field.new({"name" => "intervention_service_success",
             "type" => "radio_button",
             "display_name_en" => "Successfully implemented?",
             "option_strings_source" => "lookup lookup-yes-no"
            })
]

case_plan_section = FormSection.create_or_update!({
    "visible"=>false,
    "is_nested"=>true,
    :order_form_group => 999,
    :order => 999,
    :order_subform => 1,
    :unique_id=>"cp_case_plan_subform_case_plan_interventions",
    :parent_form=>"case",
    "editable"=>true,
    :fields => case_plan_fields_subform,
    :initial_subforms => 0,
    "name_en" => "List of Interventions and Services",
    "description_en" => "List of Interventions and Services",
    "collapsed_field_names" => ["case_plan_timeframe"]
})

case_plan_fields = [
    Field.new({"name" => "case_plan_approval_type",
              "type" => "select_box",
              "display_name_en" => "Approval Type",
              "editable"=> false,
              "disabled"=> true,
              "option_strings_source" => "lookup lookup-approval-type"
            }),
    Field.new({"name" => "case_plan_approved",
               "type" => "tick_box",
               "tick_box_label_en" => "Yes",
               "editable" => false,
               "disabled" => true,
               "display_name_en" => "Approved by Manager"
              }),
    Field.new({"name" => "case_plan_approved_date",
               "type" => "date_field",
               "editable" => false,
               "disabled" => true,
               "display_name_en" => "Date"
              }),
    Field.new({"name" => "case_plan_approved_comments",
               "type" => "textarea",
               "editable" => false,
               "disabled" => true,
               "display_name_en" => "Manager Comments"
              }),
    Field.new({"name" => "approval_status_case_plan",
               "type" => "select_box",
               "display_name_en" => "Approval Status",
               "editable"=> false,
               "disabled"=> true,
               "option_strings_source" => "lookup lookup-approval-status"
              }),
    Field.new({"name" => "case_plan_section_header",
                "type" => "separator",
                "display_name_en" => "Case Plan"
              }),
    Field.new({"name" => "date_case_plan",
              "type" => "date_field",
              "display_name_en" => "Date Case Plan Initiated",
              "editable" => true,
              "disabled" => false,
              "help_text_en" => "This field is used for the Workflow status"
             }),
    Field.new({"name" => "protection_concerns",
             "type" => "select_box",
             "display_name_en" => "Protection Concerns",
             "multi_select" => true,
             "option_strings_source" => "lookup lookup-protection-concerns"
           }),
  Field.new({"name" => "case_plan_header",
             "type" => "separator",
             "display_name_en" => "Intervention Plans and Services to be Provided",
            }),
  ##Subform##
  Field.new({"name" => "cp_case_plan_subform_case_plan_interventions",
             "type" => "subform",
             "editable" => true,
             "subform_section" => case_plan_section,
             "subform_sort_by" => "case_plan_timeframe",
             "display_name_en" => "Intervention plans and services details"
            }),
  ##Subform##
]

FormSection.create_or_update!({
  :unique_id => "cp_case_plan",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 80,
  :order => 999,
  :order_subform => 0,
  :form_group_id => "case_plan",
  "editable" => true,
  :fields => case_plan_fields,
  "name_en" => "Case Plan",
  "description_en" => "Case Plan"
})
