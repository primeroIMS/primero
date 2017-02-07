#JIRA SL-327

case_plan_fields_subform = [
  Field.new({"name" => "intervention_service_to_be_provided",
             "type" => "text_field",
             "display_name_all" => "Name of intervention / service to be provided"
           }),
  Field.new({"name" => "case_plan_provider_and_contact_details",
             "type" => "textarea",
             "display_name_all" => "Person / agency providing the service or implementing the intervention / services and contact details"
            }),
  Field.new({"name" => "intervention_service_goal",
             "type" => "textarea",
             "display_name_all" => "Goal of intervention / service"
            }),
  Field.new({"name" => "case_plan_timeframe",
             "type" => "date_field",
             "display_name_all" => "Expected timeframe (end date)"
            }),
  Field.new({"name" => "case_plan_monitoring_schedule",
             "type" => "select_box",
             "display_name_all" => "Follow up / monitoring schedule",
             "option_strings_text_all" =>
                                    ["One time",
                                     "Daily",
                                     "Weekly",
                                     "Monthly",
                                     "Other"].join("\n")
            }),
  Field.new({"name" => "intervention_service_success",
             "type" => "radio_button",
             "display_name_all" => "Successfully implemented?",
             "option_strings_text_all" => "Yes\nNo",
            })
]

case_plan_section = FormSection.create_or_update_form_section({
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
    "name_all" => "List of Interventions and Services",
    "description_all" => "List of Interventions and Services",
    "collapsed_fields" => ["case_plan_timeframe"]
})

case_plan_fields = [
    Field.new({"name" => "case_plan_approved",
               "type" => "tick_box",
               "tick_box_label_all" => "Yes",
               "editable" => false,
               "disabled" => true,
               "display_name_all" => "Approved by Manager"
              }),
    Field.new({"name" => "case_plan_approved_date",
               "type" => "date_field",
               "editable" => false,
               "disabled" => true,
               "display_name_all" => "Date"
              }),
    Field.new({"name" => "case_plan_approved_comments",
               "type" => "textarea",
               "editable" => false,
               "disabled" => true,
               "display_name_all" => "Manager Comments"
              }),
    Field.new({"name" => "approval_status_case_plan",
               "type" => "select_box",
               "display_name_all" => "Approval Status",
               "editable"=> false,
               "disabled"=> true,
               "option_strings_text_all" =>
                   ["Pending",
                    "Approved",
                    "Rejected"].join("\n")
              }),
    Field.new({"name" => "protection_concerns",
             "type" => "select_box",
             "display_name_all" => "Protection Concerns",
             "multi_select" => true,
             "option_strings_source" => "lookup lookup-protection-concerns"
           }),
  Field.new({"name" => "case_plan_header",
             "type" => "separator",
             "display_name_all" => "Intervention Plans and Services to be Provided",
            }),
  ##Subform##
  Field.new({"name" => "cp_case_plan_subform_case_plan_interventions",
             "type" => "subform",
             "editable" => true,
             "subform_section_id" => case_plan_section.unique_id,
             "subform_sort_by" => "case_plan_timeframe",
             "display_name_all" => "Intervention plans and services details"
            }),
  ##Subform##
]

FormSection.create_or_update_form_section({
  :unique_id => "cp_case_plan",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 80,
  :order => 999,
  :order_subform => 0,
  :form_group_name => "Case Plan",
  "editable" => true,
  :fields => case_plan_fields,
  "name_all" => "Case Plan",
  "description_all" => "Case Plan"
})
