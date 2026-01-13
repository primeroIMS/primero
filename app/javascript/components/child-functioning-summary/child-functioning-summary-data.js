const childFunctioningSummaryData = [
  { label: "cases.child_functioning.date", key: "date_cfm_start" },
  { label: "cases.child_functioning.ready_to_start_cfm", key: "cfm_start" },
  { label: "cases.child_functioning.age", key: "cfm_age" },

  // ---------- VISION ----------
  {
    label: "cases.child_functioning.vision_wear_glass",
    key: latestValue => `cfm_${latestValue?.cfm_age}_vision_wears_glasses`
  },

  // When child DOES NOT wear glasses
  {
    label: "cases.child_functioning.difficulty_seeing_without_glasses",
    key: latestValue => `cfm_${latestValue?.cfm_age}_vision_difficulty`,
    showIf: {
      key: latestValue => `cfm_${latestValue?.cfm_age}_vision_wears_glasses`,
      equals: "no"
    }
  },

  // When child DOES wear glasses
  {
    label: "cases.child_functioning.difficulty_seeing_with_glasses",
    key: latestValue => `cfm_${latestValue?.cfm_age}_vision_difficulty_with_glasses`,
    showIf: {
      key: latestValue => `cfm_${latestValue?.cfm_age}_vision_wears_glasses`,
      equals: "yes"
    }
  },

  // ---------- HEARING ----------
  {
    label: "cases.child_functioning.child_wears_hearing_aid",
    key: latestValue => `cfm_${latestValue?.cfm_age}_hearing_uses_hearing_aid`
  },

  // When NO hearing aid
  {
    label: "cases.child_functioning.difficulty_hearing_without_hearing_aid",
    key: latestValue => `cfm_${latestValue?.cfm_age}_hearing_difficulty`,
    showIf: {
      key: latestValue => `cfm_${latestValue?.cfm_age}_hearing_uses_hearing_aid`,
      equals: "no"
    }
  },

  // When YES hearing aid
  {
    label: "cases.child_functioning.difficulty_hearing_with_hearing_aid",
    key: latestValue => `cfm_${latestValue?.cfm_age}_hearing_difficulty_with_hearing_aid`,
    showIf: {
      key: latestValue => `cfm_${latestValue?.cfm_age}_hearing_uses_hearing_aid`,
      equals: "yes"
    }
  },

  // ---------- MOBILITY ----------
  {
    label: "cases.child_functioning.child_uses_equipment_or_receive_assistance_for_walking",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_uses_equipment`
  },

  // When YES (child uses equipment)
  {
    label: "cases.child_functioning.difficulty_walking_without_equipment",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_difficulty_without_equipment`,
    showIf: {
      key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_uses_equipment`,
      equals: "yes"
    }
  },
  {
    label: "cases.child_functioning.difficulty_walking_with_equipment",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_difficulty_with_equipment`,
    showIf: {
      key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_uses_equipment`,
      equals: "yes"
    }
  },

  // When NO (child does not use equipment)
  {
    label: "cases.child_functioning.difficulty_comparative",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_difficulty_comparative`,
    showIf: {
      key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_uses_equipment`,
      equals: "no"
    }
  },

  // ---------- DEXTERITY ----------
  {
    label: "cases.child_functioning.difficulty_picking_up_small_objects_with_hand",
    key: latestValue => `cfm_${latestValue?.cfm_age}_dexterity_difficulty`
  },

  // ---------- SELF CARE ----------
  {
    label: "cases.child_functioning.self_care_difficulty",
    key: latestValue => `cfm_${latestValue?.cfm_age}_self_care_difficulty`
  },

  // ---------- COMMUNICATION ----------
  {
    label: "cases.child_functioning.child_have_difficulty_to_understand",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_you`
  },
  {
    label: "cases.child_functioning.child_have_difficulty_to_understanding_child_household",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_child_household`
  },
  {
    label: "cases.child_functioning.difficulty_to_understanding_child_others",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_child_others`
  },
  {
    label: "cases.child_functioning.difficulty_to_understand_the_child",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_child`
  },

  // ---------- LEARNING & PLAY ----------
  {
    label: "cases.child_functioning.child_have_difficulty_for_learning",
    key: latestValue => `cfm_${latestValue?.cfm_age}_learning_difficulty`
  },
  {
    label: "cases.child_functioning.child_have_difficulty_for_playing",
    key: latestValue => `cfm_${latestValue?.cfm_age}_playing_difficulty`
  },

  // ---------- MEMORY & CONCENTRATION ----------
  {
    label: "cases.child_functioning.remembering_difficulty",
    key: latestValue => `cfm_${latestValue?.cfm_age}_remembering_difficulty`
  },
  {
    label: "cases.child_functioning.concentrating_difficulty",
    key: latestValue => `cfm_${latestValue?.cfm_age}_concentrating_difficulty`
  },

  // ---------- EMOTIONAL & BEHAVIOR ----------
  {
    label: "cases.child_functioning.accepting_change_difficulty",
    key: latestValue => `cfm_${latestValue?.cfm_age}_accepting_change_difficulty`
  },
  {
    label: "cases.child_functioning.difficulty_for_controlling_behaviour",
    key: latestValue => `cfm_${latestValue?.cfm_age}_controlling_behavior_difficulty`
  },
  {
    label: "cases.child_functioning.making_friends_difficulty",
    key: latestValue => `cfm_${latestValue?.cfm_age}_making_friends_difficulty`
  },
  {
    label: "cases.child_functioning.anxiety_how_often",
    key: latestValue => `cfm_${latestValue?.cfm_age}_anxiety_how_often`
  },
  {
    label: "cases.child_functioning.depression_how_often",
    key: latestValue => `cfm_${latestValue?.cfm_age}_depression_how_often`
  }
];

export default childFunctioningSummaryData;
