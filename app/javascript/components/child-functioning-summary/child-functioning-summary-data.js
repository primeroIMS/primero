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
    label: "cases.child_functioning.child_wears_hearing_aid",
    key: latestValue => `cfm_${latestValue?.cfm_age}_hearing_uses_hearing_aid`
  },
  {
    label: "cases.child_functioning.difficulty_hearing_with_hearing_aid",
    key: latestValue => `cfm_${latestValue?.cfm_age}_hearing_difficulty_with_hearing_aid`
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
    label: "cases.child_functioning.difficulty_walking_with_equipment",
    key: latestValue => `cfm_${latestValue?.cfm_age}_mobility_difficulty_with_equipment`
  },
  {
    label: "cases.child_functioning.difficulty_picking_up_small_objects_with_hand",
    key: latestValue => `cfm_${latestValue?.cfm_age}_dexterity_difficulty`
  },
  {
    label: "cases.child_functioning.child_have_difficulty_to_understand",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_you`
  },
  {
    label: "cases.child_functioning.difficulty_to_understand_the_child",
    key: latestValue => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_child`
  },
  {
    label: "cases.child_functioning.child_have_difficulty_for_learning",
    key: latestValue => `cfm_${latestValue?.cfm_age}_learning_difficulty`
  },
  {
    label: "cases.child_functioning.child_have_difficulty_for_playing",
    key: latestValue => `cfm_${latestValue?.cfm_age}_playing_difficulty`
  },
  {
    label: "cases.child_functioning.difficulty_for_controlling_behaviour",
    key: latestValue => `cfm_${latestValue?.cfm_age}_controlling_behavior_difficulty`
  }
];

export default childFunctioningSummaryData;
