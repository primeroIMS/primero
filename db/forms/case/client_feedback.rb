client_feedback_fields = [
  Field.new({"name" => "client_feedback_header",
             "mobile_visible" => true,
             "type" => "separator",
             "display_name_all" => "Client Feedback",
             "help_text_all" =>
                 ["Client feedback surveys provide an opportunity for clients to give feedback on the services they received and key information to help your organization identify what is working well, possible challenges, and what needs to be improved in terms of service delivery.",
                  "The Client Feedback Survey can be given at case closure, when ",
                  "- Survivor’s needs have been met as described in the Case Action Plan",
                  "- Survivor’s needs have been met to the extent possible",
                  "- Survivor requests to close the case",
                  "",
                  "The completion of a Client Feedback Survey should be voluntary and is anonymous. It is a means to elicit feedback on services to improve programming. In contexts where survivors may only seek services once, your organization may decide to use the Client Feedback form at the end of the first session, if it is feasible to do so.",
                  "",
                  "In contexts where survivors receive services for longer periods of time, you can also consider administering client feedback surveys more frequently (e.g. on a monthly or quarterly basis).",
                  "The process for using them with a survivor should be as follows:",
                  "",
                  "(1) Explain to the person that the purpose is for you and your organization to improve your services, and that their feedback is valued. ",
                  "(2) Inform the person that the information will remain anonymous and that it will not impact the services they currently receive or may need in the future. And ultimately, it is their choice as to whether they complete the survey. ",
                  "(3) A different caseworker, supervisor or other relevant staff member should be the one who gives the survey to the person and collects it from them at the end. For literate clients, this can be done independently through a paper form or an electronic form (handheld device) in which the person does not have to provide their name, just the name of the caseworker with whom they worked. "
                 ].join("\n")
            }),
  Field.new({"name" => "client_feedback_date",
             "mobile_visible" => true,
             "type" => "date_field",
             "display_name_all" => "Date when feedback was provided by survivor"
            }),
  Field.new({
             "name" => "client_feedback_administered_by",
             "type" => "select_box",
             "display_name_all" => "Questionnaire administered by",
             "option_strings_source" => "User",
             "help_text_all" =>
                 ["Instructions for staff:",
                  "-Identify who on your team is going to administer the feedback form. Identify whether it will be done in writing (giving the person the questionnaire to complete themselves) or whether a staff member will ask the questions and record the person’s answers.",
                  "-Inform the person that you will ask them some questions but will not write their name on the form and that the interview will remain anonymous.",
                  "-Explain the purpose. Say: 'This questionnaire is voluntary and confidential. Its purpose is to collect information about the services that have been provided to you and to help make improvements in the quality of care that GBV survivors receive in this community.'",
                  "-Remind the person that you will not ask them any questions about their actual case, but are just interested in the services they received throughout the case management process. ",
                  "-Get consent to proceed or if the person declines, tell the person that it is ok and if they change their minds they can contact you."
                 ].join("\n")
            }),
]

FormSection.create_or_update_form_section({
  unique_id: "client_feedback",
  parent_form: "case",
  visible: true,
  order_form_group: 160,
  order: 10,
  order_subform: 0,
  form_group_name: "Client Feedback",
  editable: true,
  fields: client_feedback_fields,
  mobile_form: true,
  name_all: "Client Feedback",
  description_all: "Client Feedback"
})