const childFunctioningSummaryData = [
  { label: "Are you ready to start the Child Functioning Module", key: "cfm_start" },
  { label: "Age", key: "cfm_age" },
  { label: "Vision wear glass", key: (latestValue) => `cfm_${latestValue?.cfm_age}_vision_wears_glasses` },
  { label: "Difficulty seeing with glasses", key: (latestValue) => `cfm_${latestValue?.cfm_age}_vision_difficulty_with_glasses` },
  { label: "The child wears hearing aid", key: (latestValue) => `cfm_${latestValue?.cfm_age}_hearing_uses_hearing_aid` },
  { label: "Difficulty hearing with hearing aid", key: (latestValue) => `cfm_${latestValue?.cfm_age}_hearing_difficulty_with_hearing_aid` },
  { label: "The child uses equipment or receive assistance for walking", key: (latestValue) => `cfm_${latestValue?.cfm_age}_mobility_uses_equipment` },
  { label: "Difficulty walking without equipment/assistance", key: (latestValue) => `cfm_${latestValue?.cfm_age}_mobility_difficulty_without_equipment` },
  { label: "Difficulty walking with equipment/assistance", key: (latestValue) => `cfm_${latestValue?.cfm_age}_mobility_difficulty_with_equipment` },
  { label: "Difficulty picking up small objects with hand", key: (latestValue) => `cfm_${latestValue?.cfm_age}_dexterity_difficulty` },
  { label: "The child have difficulty to understand", key: (latestValue) => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_you` },
  { label: "Difficulty to understand the child", key: (latestValue) => `cfm_${latestValue?.cfm_age}_communication_difficulty_understanding_child` },
  { label: "The child have difficulty for Learning", key: (latestValue) => `cfm_${latestValue?.cfm_age}_learning_difficulty` },
  { label: "The child have difficulty for playing", key: (latestValue) => `cfm_${latestValue?.cfm_age}_playing_difficulty` },
  { label: "Difficulty for controlling behaviour like kick,bite or hit others", key: (latestValue) => `cfm_${latestValue?.cfm_age}_controlling_behavior_difficulty` },
];

export default childFunctioningSummaryData;
