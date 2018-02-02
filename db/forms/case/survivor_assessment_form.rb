# survivor_assessment_fields = [
#   Field.new({"name" => "assessment_emotional_state_start",
#              "type" => "textarea",
#              "display_name_all" => "Survivor Profile",
#              "guiding_questions" => "What is the survivor's name and age?

#               Her family situation: Does she have a husband (if the husband is not the perpetrator, does he know about what happened to her)? Does she have children? Does the survivor have other relatives that are present in her life?

#               Her current living situation. Does the survivor have a place to live? Where? Who lives in the house with her?

#               Her occupation or role in the community. Does she work or have a job? Does she have some other role in the community?
#              "
#              }),
#   Field.new({"name" => "assessment_emotional_state_end",
#              "type" => "textarea",
#              "display_name_all" => "Explain what happened to the survivor",
#              "guiding_questions" => "What has happened to her? It is crucial to find out if physical force and weapons were used, whether there is any severe pain (especially head injuries) or bleeding, and whether there was vaginal/anal penetration. Immediate medical care and treatment is highly indicated in these circumstances.

#               Who the perpetrator is and whether he can access the survivor?

#               Whether or not she has sought help previously and/or already received care and treatment?

#               When the incident took place (date/time). The date/time of the incident is essential to assessing the urgency of a medical referral and for accurately informing the survivor and caregiver about medical options. Depending on when the last incident took place, different medical treatments are available.

#               How frequently has she experienced violence like this incident?
#              "
#              }),
#   Field.new({"name" => "assessment_main_concerns",
#              "type" => "textarea",
#              "display_name_all" => "Explain the survivor's main concerns",
#              "guiding_questions" => "What does the survivor identify that she wants help with?"
#              })
# ]

# FormSection.create_or_update_form_section({
#   :unique_id => "survivor_assessment_form",
#   :parent_form=>"case",
#   "visible" => true,
#   :order_form_group => 50,
#   :order => 40,
#   :order_subform => 0,
#   :form_group_name => "Survivor Assessment",
#   "editable" => true,
#   :fields => survivor_assessment_fields,
#   "name_all" => "Survivor Assessment",
#   "description_all" => "Survivor Assessment"
# })