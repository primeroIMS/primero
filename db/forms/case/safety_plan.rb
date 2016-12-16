# safety_plan_fields = [
#   Field.new({"name" => "safety_plan_main_concern",
#              "type" => "textarea",
#              "display_name_all" => "Identify safety concern (in survivor's words)"
#   }),
# 	Field.new({"name" => "safety_plan_resources_header",
#              "type" => "separator",
#              "display_name_all" => "Resources",
#              "help_text_all" => "Name the resources I am using now that I have, that can help me stay safe in following categories"
#   }),
#   Field.new({"name" => "safety_plan_resources_economic",
#              "type" => "textarea",
#              "display_name_all" => "Economic / material"
#   }),
#   Field.new({"name" => "safety_plan_resources_relationships",
#              "type" => "textarea",
#              "display_name_all" => "Relationships"
#   }),
#   Field.new({"name" => "safety_plan_resources_community",
#              "type" => "textarea",
#              "display_name_all" => "Community help"
#   }),
#   Field.new({"name" => "safety_plan_resources_other",
#              "type" => "textarea",
#              "display_name_all" => "Other"
#   }),
#   Field.new({"name" => "safety_plan_preparedness_header",
#              "type" => "separator",
#              "display_name_all" => "Safety preparedness"
#   }),
#   Field.new({"name" => "safety_plan_preparedness_signal",
#              "type" => "textarea",
#              "display_name_all" => "I will agree on a code or signal with friends, neighbors or family that will communicate that I need help if I cannot talk in front of my partner, I will use this signal to tell them that I need help:"
#   }),
#   Field.new({"name" => "safety_plan_preparedness_gathered_things",
#              "type" => "textarea",
#              "display_name_all" => "I will gather some basic things and important documents, and leave these things in a place I can reach them if I have to leave my home. Those things and documents are:"
#   }),
#   Field.new({"name" => "safety_plan_preparedness_children_destination",
#              "type" => "textarea",
#              "display_name_all" => "I will teach my children that when the violence starts they should go to:"
#   }),
#   Field.new({"name" => "safety_plan_preparedness_children_signal",
#              "type" => "textarea",
#              "display_name_all" => "I will come up with a code word or a signal with my children so that I can safely tell them when they should leave."
#   }),
#   Field.new({"name" => "safety_plan_strategies_header",
#              "type" => "separator",
#              "display_name_all" => "Safety strategies"
#   }),
#   Field.new({"name" => "safety_plan_abusers_patterns",
#              "type" => "textarea",
#              "display_name_all" => "I can recognize some patterns in the abuser’s violence that may tell me when he is about to become violent, such as (certain times of the day or week, when he is around certain friends, when he is using drugs or drinking, etc.):"
#   }),
#   Field.new({"name" => "safety_plan_reaction_to_abuse",
#              "type" => "select_box",
#              "display_name_all" => "When I see this pattern or when the violence starts, I can:",
#              "option_strings_text_all" => [
#               "Leave the house and go outside where there are other people",
#               "I can go to a friend, family or neighbor’s house (name the person)",
#               "I can make sure I have people nearby me (in my house or near it)"
#               ].join("\n")
#   }),
#   Field.new({"name" => "safety_plan_place_safe_shelter",
#              "type" => "textarea",
#              "display_name_all" => "If I have to leave my home for a few days or more, I will go to:"
#   }),
#   Field.new({"name" => "safety_plan_place_safe_shelter_confirmation_to_stay",
#              "type" => "textarea",
#              "display_name_all" => "I will check with these people now to find out if they will let me stay with them if I need to leave:"
#   }),
#   Field.new({"name" => "safety_plan_place_safe_shelter_confirmation_to_support",
#              "type" => "textarea",
#              "display_name_all" => "I will check with these people to find out if they would lend me money or food in an emergency:"
#   }),
#   Field.new({"name" => "safety_plan_steps_header",
#              "type" => "separator",
#              "display_name_all" => "Steps after leaving"
#   }),
#   Field.new({"name" => "safety_plan_steps_if_talking_to_partner",
#              "type" => "textarea",
#              "display_name_all" => "If I must talk to my partner in person after I leave, I can:"
#   }),
#   Field.new({"name" => "safety_plan_steps_people_that_help",
#              "type" => "textarea",
#              "display_name_all" => "If I stay at another location (with friends, family, community police, etc.) I can tell these people to watch for him and help me if he comes near the residence:"
#   }),
#   Field.new({"name" => "safety_plan_steps_after_relocation",
#              "type" => "textarea",
#              "display_name_all" => "If my partner comes to my new home to attack me, I will:"
#   }),
#   Field.new({"name" => "safety_plan_emotional_header",
#              "type" => "separator",
#              "display_name_all" => "Emotional health"
#   }),
#   Field.new({"name" => "safety_plan_emotional_supportive_words",
#              "type" => "textarea",
#              "display_name_all" => "If people blame me for leaving or say I am a bad wife or mother, I will say to myself:"
#   }),
#   Field.new({"name" => "safety_plan_emotional_supportive_people",
#              "type" => "textarea",
#              "display_name_all" => "If I feel sad about my situation, I can talk to the following people for support:"
#   }),
#   Field.new({"name" => "safety_plan_emotional_supportive_actions",
#              "type" => "textarea",
#              "display_name_all" => "Things I can do to make myself feel stronger are:"
#   })
# ]

# FormSection.create_or_update_form_section({
#   :unique_id=>"safety_plan",
#   :parent_form=>"case",
#   "visible" => true,
#   :order_form_group => 70,
#   :order => 10,
#   :order_subform => 0,
#   :form_group_name => "Safety Plan",
#   "editable" => true,
#   :fields => safety_plan_fields,
#   "name_all" => "Safety Plan",
#   "description_all" => "Safety Plan",
#   :mobile_form => true
# })
