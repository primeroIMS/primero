survivor_assessment_fields = [
  Field.new({"name" => "assessment_emotional_state_start",
             "type" => "textarea",
             "display_name_all" => "Survivor Context",
             "guiding_question" => "
                Her family situation:  Does she have a husband (if the husband is not the perpetrator, does he know about what happened to her)? Does she have children? Does the survivor have other relatives that are present in her life?

                Her current living situation.  Does the survivor have a place to live? Where? Who lives in the house with her? 

                Her occupation or role in the community.  Does she work or have a job?  Does she have some other role in the community?
             "
             }),
  Field.new({"name" => "assessment_emotional_state_end",
             "type" => "textarea",
             "display_name_all" => "Assessement of Presenting Problem",
             "guiding_questions" => "
                What has happened to her?  It is crucial to find out if physical force and weapons were used, whether there is any severe pain (especially head injuries) or bleeding, and whether there was vaginal/anal penetration. Immediate medical care and treatment is highly indicated in these circumstances.

                Who the perpetrator is and whether he can access the survivor?

                Whether or not she has sought help previously and/or already received care and treatment?

                When the last incident took place (date/time).  The date/time of the incident is essential to assessing the urgency of a 
                medical referral and for accurately informing the survivor and caregiver about medical options. Depending on when the last incident took place, different medical treatments are available.
             "
             }),
  Field.new({"name" => "assessment_survivor_safety",
             "type" => "textarea",
             "display_name_all" => "Assessement of Immediate Need",
             "guiding_questions" => "
                What happened to the survivor and what does she want help with?

                What are the survivor’s major concerns right now?
             "
             }),
  Field.new({"name" => "assessment_support_sources",
             "type" => "radio_button",
             "display_name_all" => "Will the survivor be in immediate danger when she leaves here?",
             "option_strings_text_all" => "Yes\nNo"
             }),
  Field.new({"name" => "assessment_safety_action",
             "type" => "textarea",
             "display_name_all" => "Explain"
             }),
  Field.new({"name" => "assessment_other_info",
             "type" => "select_box",
             "display_name_all" => "How safe does the survivor feel at home?",
             "option_strings_text_all" => ["1 = very safe",
                  "2 = somewhat safe",
                  "3 = neither safe nor unsafe",
                  "4 = somewhat unsafe",
                  "5 = not safe at all"].join("\n")
             }),
  Field.new({"name" => "assessment_safety_response",
             "type" => "select_box",
             "display_name_all" => "Describe the survivor’s emotional state",
             "option_strings_text_all" => ["1 = everything is good and fine",
                  "2 = to be determined", "3 = to be determined", "4 = to be determined",
                  "5 = things are so bad that they want to die or hurt themselves"]
             })
]

FormSection.create_or_update_form_section({
  :unique_id => "survivor_assessment_form",
  :parent_form=>"case",
  "visible" => true,
  :order_form_group => 70,
  :order => 40,
  :order_subform => 0,
  :form_group_name => "Survivor Assessment",
  "editable" => true,
  :fields => survivor_assessment_fields,
  :perm_enabled => true,
  "name_all" => "Survivor Assessment",
  "description_all" => "Survivor Assessment"
})