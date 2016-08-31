bia_fields = [
    Field.new({"name" => "bia_approved",
               "type" => "tick_box",
               "tick_box_label_all" => "Yes",
               "editable" => true,
               "display_name_all" => "Approved by Manager",
               "disable" => true,
               "visible" => true
              }),
    Field.new({"name" => "bia_approved_date",
               "type" => "date_field",
               "editable" => true,
               "display_name_all" => "Date",
               "disable" => true,
               "visible" => true
              }),
    Field.new({"name" => "bia_approved_comments",
               "type" => "textarea",
               "editable" => true,
               "display_name_all" => "Manager Comments",
               "disable" => true,
               "visible" => true
              }),
    Field.new({"name" => "approval_status_bia",
               "type" => "select_box",
               "display_name_all" => "Approval Status",
               "option_strings_text_all" =>
                   ["Pending",
                    "Approved",
                    "Rejected"].join("\n"),
               "disable" => true,
               "visible" => true
              }),
    Field.new({"name" => "case_id_display",
               "type" => "text_field",
               "display_name_all" => "Primero Case ID",
               "disable" => true,
               "visible" => true
              }),
    Field.new({"name" => "bia_header",
               "type" => "separator",
               "display_name_all" => "ASSESSMENT FORM (for completion for all Child Protection cases including UASC)",
               "disable" => true,
               "visible" => true
              }),
    Field.new({"name" => "case_priority",
               "type" => "select_box",
               "display_name_all" => "Priority",
               "disable" => true,
               "visible" => true,
               "option_strings_text_all" =>
                   ["2 days",
                    "1 week",
                    "30 days",
                    "Non Urgent (enter date)"].join("\n")
              }),
    Field.new({"name" => "case_priority_date",
               "type" => "date_field",
               "editable" => true,
               "display_name_all" => "Re-assessment date",
               "disable" => true
              }),
    Field.new({"name" => "cpims_id",
               "type" => "text_field",
               "display_name_all" => "CPIMS No",
               "disable" => true,
               "visible" => true
              })
]

FormSection.create_or_update_form_section({
    :unique_id => "cp_bia_form",
    :parent_form=>"case",
    "visible" => true,
    :order_form_group => 136,
    :order => 10,
    :order_subform => 0,
    :form_group_name => "BIA Form",
    "editable" => true,
    :fields => bia_fields,
    "name_all" => "BIA Form",
    "description_all" => "BIA Form"
})