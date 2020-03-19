survivor_assessment_fields = [
  Field.new({"name" => "assessment_emotional_state_start",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Survivor Profile",
             "guiding_questions" =>
                 ["Is the survivor a woman, man, girl or boy or other gender identity?",
                  "",
                  "How old is the survivor?  Is she a child or adult?",
                  "",
                  "Is she a resident, a refugee or internally displaced person?"
                 ].join("\n"),
             "help_text_en" => "Provide basic demographic information on the survivor, including sex, age and displacement status and any other relevant information."
            }),
  Field.new({"name" => "assessment_survivor_background",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Survivor Context (or Background Information)",
             "guiding_questions" => "Provide basic contextual information on the survivor, including her family situation, current living situation, occupation or role, and any other relevant information.",
            }),
  Field.new({"name" => "assessment_family_situation",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Survivor's family situation (for adults)",
             "guiding_questions" =>
                 ["Adult survivor's family situation:",
                  "",
                  "Is she married and/or living with an intimate partner?  (If her husband/intimate partner is not the perpetrator, does he know about what happened to her)?",
                  "",
                  "Does she have children? If so, how many and how old are they? Do her children live with her?",
                  "",
                  "Who are the other family members present in the client’s life on a daily basis?  Does the survivor have other relatives that are present in her life?"
                 ].join("\n")
            }),
  Field.new({"name" => "assessment_current_living_situation",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Survivor's current living situation",
             "guiding_questions" => "Does the survivor have a place to live? Where? Who lives in the house with her? Does she live with her husband/intimate partner? Are there relatives living nearby?"
            }),
  Field.new({"name" => "assssment_survivor_occupation",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Survivor's occupation or role",
             "guiding_questions" => "Does survivor work? Is her work at home? Have paid employment? Part-time or full-time? Does survivor have a special role in the community where s/he lives?"
            }),
  Field.new({"name" => "assessment_child_considerations",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Specific considerations for child survivors",
             "guiding_questions" => "Does she live with her parents? (If her parents or guardians are not the perpetrators, do they know about what happened to her)? Who are the other family members present in the client’s life on a daily basis? Does the survivor have other relatives that are present in her life?"
            }),
  Field.new({"name" => "assessment_presenting_problem",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Presenting Problem",
             "guiding_questions" =>
                 ["Describe what happened to the survivor in the survivor's own words. Identify what problem(s)/concern(s)/issue(s) the survivor is requesting assistance/support for.",
                  "",
                  "List survivor's main concerns in her own words (do not suggest). These might include: immediate safety, children's safety, access to economic resources, medical assistance, perception of others, etc."
                 ].join("\n")
            }),
  Field.new({"name" => "assessment_emotional_state_end",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Describe what happened to the survivor in the survivor's own words",
             "guiding_questions" => "What happened to the survivor? What is the nature of the violence? When did it occur? What prompted her to seek services? What are her main concerns? What does she want help with?"
            }),
  Field.new({"name" => "assessment_main_concerns",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Key Assessment Points",
             "guiding_questions" => "Summarize key assessment points with respect to the nature, timing, frequency and severity of the violence reported, who the perpetrator/s is/are in relation to the survivor and whether he/they have easy access to the survivor, in order to determine risk. Gauge emotional well-being, ability to keep up with day-today tasks, overall sense of safety in the world, and ability to trust others. Identify the survivor's needs (safety, health, psychosocial, legal/justice, practical/material, other) as well as her strengths and coping strategies to determine need for psychosocial support and/or appropriate and timely referrals."
             }),
  Field.new({"name" => "assessment_current_situation",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Current situation and imminent risks",
             "guiding_questions" =>
                 ["Identify situations, circumstances and people that are continuing to harm the survivor or put her at risk of harm. ",
                  "",
                  "Does/do the perpetrator/s know where the survivor is right now? If yes, does the survivor think that the perpetrator/s may come try to find her here?",
                  "",
                  "When did the incident take place (date/time)? Is survivor bleeding or have an acute injury or in any severe pain (especially head injuries)? Was there forced vaginal/anal penetration? Was physical force and/or weapons used? How frequently has survivor experienced violence like this incident?",
                  "",
                  "What is the relationship between the survivor and the perpetrator? Does the perpetrator have access to a weapon? Does the perpetrator have easy access the survivor (ex. lives in the same household, neighbourhood, etc.)? Does the perpetrator have a history of using violence against others, abusing drugs or alcohol, and/or a history of depression or other mental health issues?",
                  "",
                  "Has survivor sought help previously and/or already received care and treatment? Does survivor express any current or past suicidal thoughts? (If so, follow the Suicide Risk Assessment Protocol)"
                 ].join("\n")
            }),
  Field.new({"name" => "assessment_safety_needs",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Safety needs",
             "guiding_questions" => "Will the survivor be in immediate danger when she leaves here? How safe does the survivor feel at home? (Note: caseworker can use tools such as safety scale to help determine this). Has the survivor ever tried to get help from anyone else? Has the survivor ever tried to leave? Are aspects about the perpetrator’s profile or the type of violence that place the survivor in immediate danger?"
            }),
  Field.new({"name" => "assessment_health_needs",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Health needs",
             "guiding_questions" => "Does the client require and/or want medical attention? Did the last incident occur within the past 120 hours? Would the survivor like to know more about medication and exam options? Is the survivor complaining of physical pain and injury, or bleeding or discharge?"
            }),
  Field.new({"name" => "assessment_psychosocial_needs",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Psychosocial needs",
             "guiding_questions" =>
                 ["How does the survivor describe her emotional state?",
                  "",
                  "Based on your observations, how would you describe the survivor's appearance and behavior? Is there anything strange or unusual about the survivor's appearance or behavior right now? What is your sense of the client’s level of functioning? (Listen for indications that the survivor stopped leaving the house, conducting her daily activities, talking with or seeing family and friends, or her sleep aptterns and eating habits are disturbed).",
                  "",
                  "Does the survivor feel sad most of the time, hopeless about her situation or life? Does the survivor complain of physical aches? Are there other major changes or difficulties the survivor shares?",
                  "",
                  "What kinds of social supports does the survivor have? Who does the survivor like to talk to or spend time with outside of her house? Does she have friendships? People whom she can trust? Who are the survivor’s sources of emotional support? Has she been able to access these social supports since the incident? How have they helped her? Who/what are the people, elements, ideas, or experiences in the survivor’s life that she identifies as giving her hope and strength? ",
                  "",
                  "What are her existing assets (ex. people, knowledge, skills, income, housing)? Does she have positive coping mechanisms? What are they? Does religion and/or faith play a part in the survivor’s life? Has she been able to draw upon her faith and/or religious practice since the incident? How has doing so helped her?"
                 ].join("\n")
            }),
  Field.new({"name" => "assessment_legal_needs",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Legal/justice needs",
             "guiding_questions" =>
                 ["Does the survivor wish to report to formal authorities and/or take legal action.",
                  "",
                  "What are the risks, benefits, time and costs the survivor should factor in her decision to take legal action? Is legal recourse an immediate priority for the survivor? What information does the client need to make a decision about justice?",
                  "",
                  "Does the survivor want more information about how her legal rights and/or options for taking her case through the formal justice system, or the traditional /informal justice system? Does the survivor understand the differences between how a case would be handled through traditional vs. formal justice mechanisms?"
                 ].join("\n")
            }),
  Field.new({"name" => "assessment_material_needs",
             "show_on_minify_form" => true,
             "mobile_visible" => true,
             "type" => "textarea",
             "display_name_en" => "Practical/material needs",
             "guiding_questions" => "Does the survivor have access to income? Does the survivor have access to food, clothes, phone credit, transportation, etc.? What are the survivor's sources of support, including family and community? Is the survivor's lack of income impacting her ability to be safe? Is the survivor's lack of (or access to) income putting her at risk for violence?"
            }),
  Field.new({"name" => "assessment_completion_timing",
             "type" => "select_box",
             "display_name_en" => "How long did it take you to complete the assessment for this case?",
             "option_strings_source" => "lookup lookup-assessment-duration"
            })
]

FormSection.create_or_update_form_section({
  unique_id: "survivor_assessment_form",
  parent_form: "case",
  mobile_form: true,
  visible: true,
  order_form_group: 50,
  order: 40,
  order_subform: 0,
  form_group_id: "survivor_assessment",
  editable: true,
  fields: survivor_assessment_fields,
  name_en: "Survivor Assessment",
  description_en: "Survivor Assessment"
})
