const childFunctioningSummaryData = [
  { label: "cases.child_functioning.date", key: "date_cfm_start" },
  { label: "cases.child_functioning.ready_to_start_cfm", key: "cfm_start" },
  { label: "cases.child_functioning.age", key: "cfm_age" },
  {
    label: "cases.child_functioning.vision_wear_glass",
    key: latestValue => `cfm_${latestValue?.cfm_age}_vision_wears_glasses`
  },
  {
    label: "cases.child_functioning.difficulty_seeing_with_glasses",
    key: latestValue => `cfm_${latestValue?.cfm_age}_vision_difficulty_with_glasses`
  },
  {
    label: "cases.continue_hearing_section",
    key: latestValue => `cfm_${latestValue?.cfm_age}_hearing_display`
  },
  {
    label: "cases.child_functioning.child_wears_hearing_aid",
    key: latestValue => `cfm_${latestValue?.cfm_age}_hearing_uses_hearing_aid`
  },
  {
    label: "cases.child_functioning.difficulty_hearing_with_hearing_aid",
    key: latestValue => `cfm_${latestValue?.cfm_age}_hearing_difficulty_with_hearing_aid`
  },
  {
    label: "cases.continue_mobility_section",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_display`
  },
  {
    label: "cases.child_functioning.child_uses_equipment_or_receive_assistance_for_walking",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_uses_equipment`
  },
  {
    label: "cases.child_functioning.difficulty_walking_without_equipment",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_difficulty_without_equipment`
  },
  {
    label: "cases.mobility_difficulty_without_equipment_100m",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_difficulty_without_equipment_100m`
  },
  {
    label: "cases.mobility_difficulty_without_equipment_500m",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_difficulty_without_equipment_500m`
  },
  {
    label: "cases.child_functioning.difficulty_walking_with_equipment",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_difficulty_with_equipment`
  },
  {
    label: "cases.mobility_difficulty_with_equipment_100m",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_difficulty_with_equipment_100m`
  },
  {
    label: "cases.mobility_difficulty_with_equipment_500m",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_difficulty_with_equipment_500m`
  },
  {
    label: "cases.continue_dexterity_display_section",
    key: latestValue => `cfm_${latestValue?.cfm_age}_dexterity_display`
  },
  {
    label: "cases.child_functioning.difficulty_picking_up_small_objects_with_hand",
    key: latestValue => `cfm_${latestValue?.cfm_age}_dexterity_difficulty`
  },
  {
    label: "cases.self_care_display",
    key: latestValue => `cfm_${latestValue?.cfm_age}_self_care_display`
  },
  {
    label: "cases.self_care_difficulty",
    key: latestValue => `cfm_${latestValue?.cfm_age}_self_care_difficulty`
  },
  {
    label: "cases.communication_display_section",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_display`
  },
  {
    label: "cases.child_functioning.child_have_difficulty_to_understand",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_you`
  },
  {
    label: "cases.child_have_difficulty_to_understanding_child_household",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_child_household`
  },
  {
    label: "cases.difficulty_to_understanding_child_others",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_child_others`
  },
  {
    label: "cases.child_functioning.difficulty_to_understand_the_child",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_child`
  },
  {
    label: "cases.learning_display_section",
    key: latestValue => `cfm_${latestValue?.cfm_age}_learning_display`
  },
  {
    label: "cases.child_functioning.child_have_difficulty_for_learning",
    key: latestValue => `cfm_${latestValue?.cfm_age}_learning_difficulty`
  },
  {
    label: "cases.playing_display_section",
    key: latestValue => `cfm_${latestValue?.cfm_age}_playing_display`
  },
  {
    label: "cases.child_functioning.child_have_difficulty_for_playing",
    key: latestValue => `cfm_${latestValue?.cfm_age}_playing_difficulty`
  },
  {
    label: "cases.remembering_display",
    key: latestValue => `cfm_${latestValue?.cfm_age}_remembering_display`
  },
  {
    label: "cases.remembering_difficulty",
    key: latestValue => `cfm_${latestValue?.cfm_age}_remembering_difficulty`
  },
  {
    label: "cases.concentrating_display",
    key: latestValue => `cfm_${latestValue?.cfm_age}_concentrating_display`
  },
  {
    label: "cases.concentrating_difficulty",
    key: latestValue => `cfm_${latestValue?.cfm_age}_concentrating_difficulty`
  },
  {
    label: "cases.accepting_change_display",
    key: latestValue => `cfm_${latestValue?.cfm_age}_accepting_change_display`
  },
  {
    label: "cases.accepting_change_difficulty",
    key: latestValue => `cfm_${latestValue?.cfm_age}_accepting_change_difficulty`
  },
  {
    label: "cases.controlling_behavior_display_section",
    key: latestValue => `cfm_${latestValue?.cfm_age}_controlling_behavior_display`
  },
  {
    label: "cases.child_functioning.difficulty_for_controlling_behaviour",
    key: latestValue => `cfm_${latestValue?.cfm_age}_controlling_behavior_difficulty`
  },
  {
    label: "cases.making_friends_display_section",
    key: latestValue => `cfm_${latestValue?.cfm_age}_making_friends_display`
  },
  {
    label: "cases.making_friends_difficulty",
    key: latestValue => `cfm_${latestValue?.cfm_age}_making_friends_difficulty`
  },
  {
    label: "cases.anxiety_display_section",
    key: latestValue => `cfm_${latestValue?.cfm_age}_anxiety_display`
  },
  {
    label: "cases.anxiety_how_often",
    key: latestValue => `cfm_${latestValue?.cfm_age}_anxiety_how_often`
  },
  {
    label: "cases.depression_display_section",
    key: latestValue => `cfm_${latestValue?.cfm_age}_depression_display`
  },
  {
    label: "cases.depression_how_often",
    key: latestValue => `cfm_${latestValue?.cfm_age}_depression_how_often`
  }
];

export default childFunctioningSummaryData;
